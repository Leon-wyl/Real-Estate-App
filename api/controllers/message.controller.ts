import prisma from "../lib/prisma.js";
import { getIO } from "../lib/socket.js";
import { Request, Response } from "express";

export const addMessage = async (req: Request, res: Response) => {
  const tokenUserId = req.userId!;
  const chatId = req.params.chatId as string;
  const text = req.body.text;

  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ message: "Text is required!" });
  }

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    if (!chat.userIDs.includes(tokenUserId)) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    const message = await prisma.message.create({
      data: {
        text: text.trim(),
        userId: tokenUserId,
        chatId,
      },
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: {
        seenBy: [tokenUserId],
        lastMessage: text.trim(),
      },
    });

    try {
      getIO().to(chatId).emit("newMessage", message);
    } catch (_e) {
      // socket not initialized in test env
    }

    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};
