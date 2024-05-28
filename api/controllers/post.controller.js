import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;
  console.log(query);
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 999999999,
        },
      },
    });

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts!" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
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

    // check if the user is authenticated, if yes, fetch whether post is saved
    let userId;
    let saved;
    const token = req.cookies?.token;
    if (!token) {
      userId = null;
    } else {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!token) {
          userId = null;
        } else {
          userId = payload.id;

          saved = await prisma.savedPost.findUnique({
            where: {
              postId: id,
              userId,
            },
          });
        }
      });
    }

    res.status(200).json({ ...post, isSaved: saved ? true : false }); // add isSaved to the post object
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts!" });
  }
};

export const addPosts = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;
  console.log(body.postDetail);

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts!" });
  }
};

export const updatePost = async (req, res) => {
  try {
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts!" });
  }
};

export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const tokenUserId = req.userId;
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    res.status(200).json({ message: "Post deleted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts!" });
  }
};
