import express, { Request, Response, NextFunction } from "express";
import Blog from "../models/Blog";
import authMiddleware, { AuthRequest } from "../middleware/auth";

const router = express.Router();

// Create a blog post
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const newBlog = new Blog({
      userId: req.user.id, // Ensure req.user.id exists
      title,
      content,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
