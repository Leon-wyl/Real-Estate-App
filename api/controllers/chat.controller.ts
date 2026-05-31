import prisma from "../lib/prisma.js";
import { getIO } from "../lib/socket.js";
import { Request, Response } from "express";

export const getChats = async (req: Request, res: Response) => {
  const tokenUserId = req.userId!;
  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: { has: tokenUserId },
      },
      orderBy: { createdAt: "desc" },
      include: {
        users: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });
    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

export const getChat = async (req: Request, res: Response) => {
  const tokenUserId = req.userId!;
  const id = req.params.id as string;
  try {
    const chat = await prisma.chat.findUnique({
      where: { id },
      include: {
        messages: {
          include: {
            sender: {
              select: { id: true, username: true, avatar: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    if (!chat.userIDs.includes(tokenUserId)) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const addChat = async (req: Request, res: Response) => {
  const tokenUserId = req.userId!;
  const receiverId = req.body.receiverId as string;

  if (!receiverId) {
    return res.status(400).json({ message: "receiverId is required!" });
  }

  try {
    const existing = await prisma.chat.findFirst({
      where: {
        userIDs: {
          hasEvery: [tokenUserId, receiverId],
        },
      },
    });

    if (existing) {
      return res.status(200).json(existing);
    }

    const chat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId],
        seenBy: [tokenUserId],
      },
    });

    try {
      getIO().to(receiverId).emit("newChat", chat);
    } catch (_e) {
      // socket not initialized in test env
    }

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create chat!" });
  }
};

export const readChat = async (req: Request, res: Response) => {
  const tokenUserId = req.userId!;
  const id = req.params.id as string;
  try {
    const chat = await prisma.chat.findUnique({
      where: { id },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    if (!chat.userIDs.includes(tokenUserId)) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    if (!chat.seenBy.includes(tokenUserId)) {
      const updatedChat = await prisma.chat.update({
        where: { id },
        data: {
          seenBy: {
            push: tokenUserId,
          },
        },
      });

      try {
        getIO().to(id).emit("chatRead", { chatId: id, userId: tokenUserId });
      } catch (_e) {
        // socket not initialized in test env
      }

      return res.status(200).json(updatedChat);
    }

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
