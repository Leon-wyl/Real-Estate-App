import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

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
    chat: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    message: {
      create: vi.fn(),
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

const { default: app } = await import("../app.js");

const validCookie = ["token=valid-token"];
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
  mocks.jwt.verify.mockImplementation((token: string, _secret: string, callback?: Function) => {
    if (callback) {
      callback(token === "valid-token" ? null : new Error("invalid token"), token === "valid-token" ? { id: "user-1" } : undefined);
      return;
    }
    if (token === "valid-token") {
      return { id: "user-1" };
    }
    throw new Error("invalid token");
  });
});

afterAll(() => {
  consoleLogSpy.mockRestore();
});

describe("API routes", () => {
  it("GET / returns API health message", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Real Estate API is running!" });
  });

  describe("auth routes", () => {
    it("registers a user", async () => {
      mocks.prisma.user.create.mockResolvedValue({ id: "user-1" });

      const res = await request(app)
        .post("/api/auth/register")
        .send({ username: "alice", email: "alice@test.com", password: "secret" });

      expect(res.status).toBe(201);
      expect(mocks.bcrypt.hash).toHaveBeenCalledWith("secret", 10);
      expect(mocks.prisma.user.create).toHaveBeenCalledWith({
        data: { username: "alice", email: "alice@test.com", password: "hashed-password" },
      });
    });

    it("returns 500 when register fails", async () => {
      mocks.prisma.user.create.mockRejectedValue(new Error("db error"));

      const res = await request(app).post("/api/auth/register").send({ username: "alice", password: "secret" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Failed to create user!" });
    });

    it("logs in and sets a token cookie", async () => {
      mocks.prisma.user.findUnique.mockResolvedValue({
        id: "user-1",
        username: "alice",
        password: "hashed-password",
        email: "alice@test.com",
      });

      const res = await request(app).post("/api/auth/login").send({ username: "alice", password: "secret" });

      expect(res.status).toBe(200);
      expect(res.headers["set-cookie"][0]).toContain("token=signed-token");
      expect(res.body).toEqual({ id: "user-1", username: "alice", email: "alice@test.com" });
    });

    it("rejects login for a missing user", async () => {
      mocks.prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app).post("/api/auth/login").send({ username: "alice", password: "secret" });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: "Invalid Credentials" });
    });

    it("rejects login for an invalid password", async () => {
      mocks.prisma.user.findUnique.mockResolvedValue({ id: "user-1", username: "alice", password: "hashed-password" });
      mocks.bcrypt.compare.mockResolvedValue(false);

      const res = await request(app).post("/api/auth/login").send({ username: "alice", password: "bad" });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: "Invalid Credentials" });
    });

    it("logs out", async () => {
      const res = await request(app).post("/api/auth/logout");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Logout Successful" });
      expect(res.headers["set-cookie"][0]).toContain("token=;");
    });
  });

  describe("post routes", () => {
    it("lists posts with filters", async () => {
      const posts = [{ id: "post-1", title: "Home" }];
      mocks.prisma.post.findMany.mockResolvedValue(posts);

      const res = await request(app).get("/api/posts?city=Melbourne&type=rent&property=house&bedroom=2&minPrice=100&maxPrice=500");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(posts);
      expect(mocks.prisma.post.findMany).toHaveBeenCalledWith({
        where: {
          city: "Melbourne",
          type: "rent",
          property: "house",
          bedroom: 2,
          price: { gte: 100, lte: 500 },
        },
      });
    });

    it("gets a post without saved state when unauthenticated", async () => {
      mocks.prisma.post.findUnique.mockResolvedValue({ id: "post-1", title: "Home" });

      const res = await request(app).get("/api/posts/post-1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: "post-1", title: "Home", isSaved: false });
      expect(mocks.prisma.savedPost.findUnique).not.toHaveBeenCalled();
    });

    it("gets a saved post when authenticated", async () => {
      mocks.prisma.post.findUnique.mockResolvedValue({ id: "post-1", title: "Home" });
      mocks.prisma.savedPost.findUnique.mockResolvedValue({ id: "saved-1" });

      const res = await request(app).get("/api/posts/post-1").set("Cookie", validCookie);

      expect(res.status).toBe(200);
      expect(res.body.isSaved).toBe(true);
    });

    it("returns 404 for a missing post", async () => {
      mocks.prisma.post.findUnique.mockResolvedValue(null);

      const res = await request(app).get("/api/posts/missing");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Post not found!" });
    });

    it("rejects protected post routes without a token", async () => {
      expect((await request(app).post("/api/posts").send({})).status).toBe(401);
      expect((await request(app).put("/api/posts/id").send({})).status).toBe(401);
      expect((await request(app).delete("/api/posts/post-1")).status).toBe(401);
    });

    it("creates a post with a valid token", async () => {
      const post = { id: "post-1", title: "Home" };
      mocks.prisma.post.create.mockResolvedValue(post);

      const res = await request(app)
        .post("/api/posts")
        .set("Cookie", validCookie)
        .send({ postData: { title: "Home" }, postDetail: { desc: "Nice" } });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(post);
      expect(mocks.prisma.post.create).toHaveBeenCalledWith({
        data: { title: "Home", userId: "user-1", postDetail: { create: { desc: "Nice" } } },
      });
    });

    it("returns 200 for the current update post route", async () => {
      const res = await request(app).put("/api/posts/id").set("Cookie", validCookie).send({});

      expect(res.status).toBe(200);
    });

    it("deletes a post only for its owner", async () => {
      mocks.prisma.post.findUnique.mockResolvedValueOnce(null);
      expect((await request(app).delete("/api/posts/post-1").set("Cookie", validCookie)).status).toBe(404);

      mocks.prisma.post.findUnique.mockResolvedValueOnce({ id: "post-1", userId: "other-user" });
      expect((await request(app).delete("/api/posts/post-1").set("Cookie", validCookie)).status).toBe(403);

      mocks.prisma.post.findUnique.mockResolvedValueOnce({ id: "post-1", userId: "user-1" });
      mocks.prisma.post.delete.mockResolvedValue({ id: "post-1" });
      const res = await request(app).delete("/api/posts/post-1").set("Cookie", validCookie);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Post deleted successfully!" });
    });
  });

  describe("user routes", () => {
    it("lists users and gets a user", async () => {
      mocks.prisma.user.findMany.mockResolvedValue([{ id: "user-1" }]);
      mocks.prisma.user.findUnique.mockResolvedValue({ id: "user-1" });

      expect((await request(app).get("/api/users")).body).toEqual([{ id: "user-1" }]);
      expect((await request(app).get("/api/users/user-1")).body).toEqual({ id: "user-1" });
    });

    it("rejects protected user routes without a token", async () => {
      expect((await request(app).put("/api/users/user-1").send({})).status).toBe(401);
      expect((await request(app).delete("/api/users/user-1")).status).toBe(401);
      expect((await request(app).post("/api/users/save").send({ postId: "post-1" })).status).toBe(401);
    });

    it("updates only the authenticated user", async () => {
      expect((await request(app).put("/api/users/other-user").set("Cookie", validCookie).send({ username: "Alice" })).status).toBe(403);

      mocks.prisma.user.update.mockResolvedValue({ id: "user-1", username: "Alice", password: "hashed-password" });
      const res = await request(app).put("/api/users/user-1").set("Cookie", validCookie).send({ username: "Alice", password: "secret" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: "user-1", username: "Alice" });
    });

    it("deletes only the authenticated user", async () => {
      expect((await request(app).delete("/api/users/other-user").set("Cookie", validCookie)).status).toBe(403);

      mocks.prisma.user.delete.mockResolvedValue({ id: "user-1" });
      const res = await request(app).delete("/api/users/user-1").set("Cookie", validCookie);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "User deleted successfully!" });
    });

    it("saves and unsaves posts", async () => {
      mocks.prisma.savedPost.findUnique.mockResolvedValueOnce(null);
      mocks.prisma.savedPost.create.mockResolvedValue({ id: "saved-1" });
      expect((await request(app).post("/api/users/save").set("Cookie", validCookie).send({ postId: "post-1" })).body).toEqual({
        message: "Post saved successfully!",
      });

      mocks.prisma.savedPost.findUnique.mockResolvedValueOnce({ id: "saved-1" });
      mocks.prisma.savedPost.delete.mockResolvedValue({ id: "saved-1" });
      expect((await request(app).post("/api/users/save").set("Cookie", validCookie).send({ postId: "post-1" })).body).toEqual({
        message: "Post unsaved successfully!",
      });
    });

    it("gets notification count", async () => {
      mocks.prisma.chat.count.mockResolvedValue(2);

      const res = await request(app)
        .get("/api/users/notification")
        .set("Cookie", validCookie);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ count: 2 });
    });
  });

  describe("chat routes", () => {
    it("rejects without token", async () => {
      expect((await request(app).get("/api/chats")).status).toBe(401);
      expect((await request(app).get("/api/chats/chat-1")).status).toBe(401);
      expect((await request(app).post("/api/chats").send({ receiverId: "user-2" })).status).toBe(401);
      expect((await request(app).put("/api/chats/read/chat-1")).status).toBe(401);
    });

    it("lists chats for authenticated user", async () => {
      mocks.prisma.chat.findMany.mockResolvedValue([{ id: "chat-1", userIDs: ["user-1", "user-2"] }]);

      const res = await request(app).get("/api/chats").set("Cookie", validCookie);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: "chat-1", userIDs: ["user-1", "user-2"] }]);
    });

    it("gets a single chat", async () => {
      mocks.prisma.chat.findUnique.mockResolvedValue({ id: "chat-1", userIDs: ["user-1", "user-2"], messages: [] });

      const res = await request(app).get("/api/chats/chat-1").set("Cookie", validCookie);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: "chat-1", userIDs: ["user-1", "user-2"], messages: [] });
    });

    it("creates a new chat", async () => {
      mocks.prisma.chat.findFirst.mockResolvedValue(null);
      mocks.prisma.chat.create.mockResolvedValue({ id: "chat-1", userIDs: ["user-1", "user-2"] });

      const res = await request(app)
        .post("/api/chats")
        .set("Cookie", validCookie)
        .send({ receiverId: "user-2" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: "chat-1", userIDs: ["user-1", "user-2"] });
    });

    it("rejects addChat without receiverId", async () => {
      const res = await request(app)
        .post("/api/chats")
        .set("Cookie", validCookie)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "receiverId is required!" });
    });

    it("reads a chat", async () => {
      mocks.prisma.chat.findUnique.mockResolvedValue({ id: "chat-1", userIDs: ["user-1", "user-2"], seenBy: [] });
      mocks.prisma.chat.update.mockResolvedValue({ id: "chat-1", seenBy: ["user-1"] });

      const res = await request(app).put("/api/chats/read/chat-1").set("Cookie", validCookie);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: "chat-1", seenBy: ["user-1"] });
    });

    it("reads an already seen chat", async () => {
      mocks.prisma.chat.findUnique.mockResolvedValue({ id: "chat-1", userIDs: ["user-1", "user-2"], seenBy: ["user-1"] });

      const res = await request(app).put("/api/chats/read/chat-1").set("Cookie", validCookie);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: "chat-1", userIDs: ["user-1", "user-2"], seenBy: ["user-1"] });
    });

    it("rejects read for non-member", async () => {
      mocks.prisma.chat.findUnique.mockResolvedValue({ id: "chat-1", userIDs: ["user-2", "user-3"] });

      const res = await request(app).put("/api/chats/read/chat-1").set("Cookie", validCookie);

      expect(res.status).toBe(403);
    });
  });

  describe("message routes", () => {
    it("rejects without token", async () => {
      expect((await request(app).post("/api/messages/chat-1").send({ text: "hello" })).status).toBe(401);
    });

    it("adds a message to a chat", async () => {
      mocks.prisma.chat.findUnique.mockResolvedValue({ id: "chat-1", userIDs: ["user-1", "user-2"] });
      mocks.prisma.message.create.mockResolvedValue({ id: "msg-1", text: "hello", userId: "user-1", chatId: "chat-1" });

      const res = await request(app)
        .post("/api/messages/chat-1")
        .set("Cookie", validCookie)
        .send({ text: "hello" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: "msg-1", text: "hello", userId: "user-1", chatId: "chat-1" });
    });

    it("returns 404 for missing chat", async () => {
      mocks.prisma.chat.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/messages/missing")
        .set("Cookie", validCookie)
        .send({ text: "hello" });

      expect(res.status).toBe(404);
    });

    it("returns 400 for empty text", async () => {
      const res = await request(app)
        .post("/api/messages/chat-1")
        .set("Cookie", validCookie)
        .send({ text: "" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "Text is required!" });
    });
  });
});
