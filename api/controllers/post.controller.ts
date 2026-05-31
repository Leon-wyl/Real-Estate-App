import prisma from "../lib/prisma.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";

export const getPosts = async (req: Request, res: Response) => {
  const query = req.query as Record<string, string | undefined>;
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: (query.type as any) || undefined,
        property: (query.property as any) || undefined,
        bedroom: parseInt(query.bedroom as string) || undefined,
        price: {
          gte: parseInt(query.minPrice as string) || 0,
          lte: parseInt(query.maxPrice as string) || 999999999,
        },
      },
    });

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts!" });
  }
};

export const getPost = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id: id as string },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    // check if the user is authenticated, if yes, fetch whether post is saved
    const token = req.cookies?.token;
    let isSaved = false;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id as string,
              userId: payload.id,
            },
          },
        });
        isSaved = saved ? true : false;
      } catch (_err) {
        // Token invalid or expired, ignore and treat as unauthenticated
      }
    }

    res.status(200).json({ ...post, isSaved });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post!" });
  }
};

export const addPosts = async (req: Request, res: Response) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId!,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post!" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update post!" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const tokenUserId = req.userId;
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId as string },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await prisma.post.delete({
      where: { id: postId as string },
    });

    res.status(200).json({ message: "Post deleted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post!" });
  }
};
