import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getPosts, getPost, addPosts, updatePost, deletePost } from '../controllers/post.controller.js';

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", verifyToken, addPosts);
router.put("/id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;