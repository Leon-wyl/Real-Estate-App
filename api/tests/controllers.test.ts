import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { Request, Response } from "express";

const mocks = vi.hoisted(() => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    post: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
    },
    savedPost: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
  bcrypt: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
  jwt: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

vi.mock("../lib/prisma.js", () => ({ default: mocks.prisma }));
vi.mock("bcrypt", () => ({ default: mocks.bcrypt }));
vi.mock("jsonwebtoken", () => ({ default: mocks.jwt }));

const auth = await import("../controllers/auth.controller.js");
const posts = await import("../controllers/post.controller.js");
const users = await import("../controllers/user.controller.js");

const mockResponse = () => {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
    cookie: vi.fn(),
    clearCookie: vi.fn(),
  };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  res.cookie.mockReturnValue(res);
  res.clearCookie.mockReturnValue(res);
  return res as unknown as Response & typeof res;
};

const req = (value: Partial<Request> & { userId?: string }) => value as Request;
let consoleLogSpy: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
  consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
});

beforeEach(() => {
  vi.clearAllMocks();
  process.env.JWT_SECRET_KEY = "test-secret";
  mocks.bcrypt.hash.mockResolvedValue("hashed-password");
  mocks.bcrypt.compare.mockResolvedValue(true);
  mocks.jwt.sign.mockReturnValue("signed-token");
  mocks.jwt.verify.mockImplementation((token: string) => {
    if (token === "valid-token") {
      return { id: "user-1" };
    }
    throw new Error("invalid token");
  });
});

afterAll(() => {
  consoleLogSpy.mockRestore();
});

describe("auth controller", () => {
  it("register hashes the password and creates a user", async () => {
    const res = mockResponse();
    mocks.prisma.user.create.mockResolvedValue({ id: "user-1" });

    await auth.register(req({ body: { username: "alice", email: "alice@test.com", password: "secret" } }), res);

    expect(mocks.bcrypt.hash).toHaveBeenCalledWith("secret", 10);
    expect(mocks.prisma.user.create).toHaveBeenCalledWith({
      data: { username: "alice", email: "alice@test.com", password: "hashed-password" },
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "User created successfully" });
  });

  it("register handles errors", async () => {
    const res = mockResponse();
    mocks.prisma.user.create.mockRejectedValue(new Error("db error"));

    await auth.register(req({ body: { username: "alice", password: "secret" } }), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Failed to create user!" });
  });

  it("login rejects missing user and invalid password", async () => {
    const resMissing = mockResponse();
    mocks.prisma.user.findUnique.mockResolvedValueOnce(null);
    await auth.login(req({ body: { username: "alice", password: "secret" } }), resMissing);
    expect(resMissing.status).toHaveBeenCalledWith(401);

    const resInvalid = mockResponse();
    mocks.prisma.user.findUnique.mockResolvedValueOnce({ id: "user-1", username: "alice", password: "hashed-password" });
    mocks.bcrypt.compare.mockResolvedValueOnce(false);
    await auth.login(req({ body: { username: "alice", password: "bad" } }), resInvalid);
    expect(resInvalid.status).toHaveBeenCalledWith(401);
  });

  it("login sets a cookie and omits the password", async () => {
    const res = mockResponse();
    mocks.prisma.user.findUnique.mockResolvedValue({ id: "user-1", username: "alice", password: "hashed-password" });

    await auth.login(req({ body: { username: "alice", password: "secret" } }), res);

    expect(res.cookie).toHaveBeenCalledWith("token", "signed-token", { httpOnly: true, maxAge: 604800000 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: "user-1", username: "alice" });
  });

  it("login handles errors", async () => {
    const res = mockResponse();
    mocks.prisma.user.findUnique.mockRejectedValue(new Error("db error"));

    await auth.login(req({ body: { username: "alice", password: "secret" } }), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Failed to login!" });
  });

  it("logout clears the token cookie", () => {
    const res = mockResponse();

    auth.logout(req({}), res);

    expect(res.clearCookie).toHaveBeenCalledWith("token");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Logout Successful" });
  });
});

describe("post controller", () => {
  it("getPosts builds filters and returns posts", async () => {
    const res = mockResponse();
    mocks.prisma.post.findMany.mockResolvedValue([{ id: "post-1" }]);

    await posts.getPosts(
      req({ query: { city: "Melbourne", type: "rent", property: "house", bedroom: "2", minPrice: "100", maxPrice: "500" } }),
      res
    );

    expect(mocks.prisma.post.findMany).toHaveBeenCalledWith({
      where: {
        city: "Melbourne",
        type: "rent",
        property: "house",
        bedroom: 2,
        price: { gte: 100, lte: 500 },
      },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: "post-1" }]);
  });

  it("getPosts handles errors", async () => {
    const res = mockResponse();
    mocks.prisma.post.findMany.mockRejectedValue(new Error("db error"));

    await posts.getPosts(req({ query: {} }), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Failed to get posts!" });
  });

  it("getPost returns 404 when missing", async () => {
    const res = mockResponse();
    mocks.prisma.post.findUnique.mockResolvedValue(null);

    await posts.getPost(req({ params: { id: "post-1" } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Post not found!" });
  });

  it("getPost returns saved state and ignores invalid tokens", async () => {
    const resSaved = mockResponse();
    mocks.prisma.post.findUnique.mockResolvedValue({ id: "post-1" });
    mocks.prisma.savedPost.findUnique.mockResolvedValue({ id: "saved-1" });

    await posts.getPost(req({ params: { id: "post-1" }, cookies: { token: "valid-token" } }), resSaved);

    expect(resSaved.json).toHaveBeenCalledWith({ id: "post-1", isSaved: true });

    const resInvalid = mockResponse();
    await posts.getPost(req({ params: { id: "post-1" }, cookies: { token: "bad-token" } }), resInvalid);

    expect(resInvalid.json).toHaveBeenCalledWith({ id: "post-1", isSaved: false });
  });

  it("getPost handles errors", async () => {
    const res = mockResponse();
    mocks.prisma.post.findUnique.mockRejectedValue(new Error("db error"));

    await posts.getPost(req({ params: { id: "post-1" } }), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Failed to get post!" });
  });

  it("addPosts creates a post for the authenticated user", async () => {
    const res = mockResponse();
    mocks.prisma.post.create.mockResolvedValue({ id: "post-1" });

    await posts.addPosts(req({ userId: "user-1", body: { postData: { title: "Home" }, postDetail: { desc: "Nice" } } }), res);

    expect(mocks.prisma.post.create).toHaveBeenCalledWith({
      data: { title: "Home", userId: "user-1", postDetail: { create: { desc: "Nice" } } },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: "post-1" });
  });

  it("addPosts handles errors", async () => {
    const res = mockResponse();
    mocks.prisma.post.create.mockRejectedValue(new Error("db error"));

    await posts.addPosts(req({ userId: "user-1", body: { postData: {}, postDetail: {} } }), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Failed to create post!" });
  });

  it("updatePost returns the current 200 response", async () => {
    const res = mockResponse();

    await posts.updatePost(req({}), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith();
  });

  it("deletePost handles missing, unauthorized, success, and errors", async () => {
    const missing = mockResponse();
    mocks.prisma.post.findUnique.mockResolvedValueOnce(null);
    await posts.deletePost(req({ userId: "user-1", params: { id: "post-1" } }), missing);
    expect(missing.status).toHaveBeenCalledWith(404);

    const unauthorized = mockResponse();
    mocks.prisma.post.findUnique.mockResolvedValueOnce({ id: "post-1", userId: "other-user" });
    await posts.deletePost(req({ userId: "user-1", params: { id: "post-1" } }), unauthorized);
    expect(unauthorized.status).toHaveBeenCalledWith(403);

    const success = mockResponse();
    mocks.prisma.post.findUnique.mockResolvedValueOnce({ id: "post-1", userId: "user-1" });
    mocks.prisma.post.delete.mockResolvedValueOnce({ id: "post-1" });
    await posts.deletePost(req({ userId: "user-1", params: { id: "post-1" } }), success);
    expect(success.status).toHaveBeenCalledWith(200);

    const failure = mockResponse();
    mocks.prisma.post.findUnique.mockRejectedValueOnce(new Error("db error"));
    await posts.deletePost(req({ userId: "user-1", params: { id: "post-1" } }), failure);
    expect(failure.status).toHaveBeenCalledWith(500);
  });
});

describe("user controller", () => {
  it("getUsers and getUser return data", async () => {
    const usersRes = mockResponse();
    mocks.prisma.user.findMany.mockResolvedValue([{ id: "user-1" }]);
    await users.getUsers(req({}), usersRes);
    expect(usersRes.json).toHaveBeenCalledWith([{ id: "user-1" }]);

    const userRes = mockResponse();
    mocks.prisma.user.findUnique.mockResolvedValue({ id: "user-1" });
    await users.getUser(req({ params: { id: "user-1" } }), userRes);
    expect(userRes.json).toHaveBeenCalledWith({ id: "user-1" });
  });

  it("getUsers and getUser handle errors", async () => {
    const usersRes = mockResponse();
    mocks.prisma.user.findMany.mockRejectedValue(new Error("db error"));
    await users.getUsers(req({}), usersRes);
    expect(usersRes.status).toHaveBeenCalledWith(500);

    const userRes = mockResponse();
    mocks.prisma.user.findUnique.mockRejectedValue(new Error("db error"));
    await users.getUser(req({ params: { id: "user-1" } }), userRes);
    expect(userRes.status).toHaveBeenCalledWith(500);
  });

  it("updateUser rejects non-owner and updates owner", async () => {
    const unauthorized = mockResponse();
    await users.updateUser(req({ userId: "user-1", params: { id: "other-user" }, body: {} }), unauthorized);
    expect(unauthorized.status).toHaveBeenCalledWith(403);

    const success = mockResponse();
    mocks.prisma.user.update.mockResolvedValue({ id: "user-1", username: "Alice", password: "hashed-password" });
    await users.updateUser(req({ userId: "user-1", params: { id: "user-1" }, body: { username: "Alice", password: "secret" } }), success);
    expect(mocks.bcrypt.hash).toHaveBeenCalledWith("secret", 10);
    expect(success.json).toHaveBeenCalledWith({ id: "user-1", username: "Alice" });
  });

  it("updateUser handles errors", async () => {
    const res = mockResponse();
    mocks.prisma.user.update.mockRejectedValue(new Error("db error"));

    await users.updateUser(req({ userId: "user-1", params: { id: "user-1" }, body: {} }), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Failed to update user!" });
  });

  it("deleteUser rejects non-owner, deletes owner, and handles errors", async () => {
    const unauthorized = mockResponse();
    await users.deleteUser(req({ userId: "user-1", params: { id: "other-user" } }), unauthorized);
    expect(unauthorized.status).toHaveBeenCalledWith(403);

    const success = mockResponse();
    mocks.prisma.user.delete.mockResolvedValueOnce({ id: "user-1" });
    await users.deleteUser(req({ userId: "user-1", params: { id: "user-1" } }), success);
    expect(success.json).toHaveBeenCalledWith({ message: "User deleted successfully!" });

    const failure = mockResponse();
    mocks.prisma.user.delete.mockRejectedValueOnce(new Error("db error"));
    await users.deleteUser(req({ userId: "user-1", params: { id: "user-1" } }), failure);
    expect(failure.status).toHaveBeenCalledWith(500);
  });

  it("savePost creates, deletes, and handles errors", async () => {
    const create = mockResponse();
    mocks.prisma.savedPost.findUnique.mockResolvedValueOnce(null);
    mocks.prisma.savedPost.create.mockResolvedValueOnce({ id: "saved-1" });
    await users.savePost(req({ userId: "user-1", body: { postId: "post-1" } }), create);
    expect(create.json).toHaveBeenCalledWith({ message: "Post saved successfully!" });

    const remove = mockResponse();
    mocks.prisma.savedPost.findUnique.mockResolvedValueOnce({ id: "saved-1" });
    mocks.prisma.savedPost.delete.mockResolvedValueOnce({ id: "saved-1" });
    await users.savePost(req({ userId: "user-1", body: { postId: "post-1" } }), remove);
    expect(remove.json).toHaveBeenCalledWith({ message: "Post unsaved successfully!" });

    const failure = mockResponse();
    mocks.prisma.savedPost.findUnique.mockRejectedValueOnce(new Error("db error"));
    await users.savePost(req({ userId: "user-1", body: { postId: "post-1" } }), failure);
    expect(failure.status).toHaveBeenCalledWith(500);
  });
});
