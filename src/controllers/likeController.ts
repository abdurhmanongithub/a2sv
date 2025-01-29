import { Request, Response } from "express";
import prisma from "../utils/prisma";

// Create Like (Add like to a blog)
export const createLike = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.userId; // Get the logged-in user
  const { blogId } = req.params; // Get the blogId from the params

  if (!userId) {
    return res.status(401).json({ error: "You must be logged in to like a blog." });
  }

  try {
    // Check if the user has already liked the blog
    const existingLike = await prisma.like.findUnique({
      where: { userId_blogId: { userId, blogId: Number(blogId) } },
    });

    if (existingLike) {
      return res.status(400).json({ error: "You have already liked this blog." });
    }

    // Create a new like for the blog
    const like = await prisma.like.create({
      data: {
        userId,
        blogId: Number(blogId),
      },
    });

    return res.status(201).json({ message: "Blog liked successfully", like });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};

// Unlike (Remove like from a blog)
export const removeLike = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.userId; // Get the logged-in user
  const { blogId } = req.params; // Get the blogId from the params

  if (!userId) {
    return res.status(401).json({ error: "You must be logged in to unlike a blog." });
  }

  try {
    // Check if the user has already liked the blog
    const existingLike = await prisma.like.findUnique({
      where: { userId_blogId: { userId, blogId: Number(blogId) } },
    });

    if (!existingLike) {
      return res.status(400).json({ error: "You have not liked this blog yet." });
    }

    // Remove the like
    await prisma.like.delete({
      where: { userId_blogId: { userId, blogId: Number(blogId) } },
    });

    return res.status(200).json({ message: "Like removed successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};

// Get likes for a specific blog
export const getLikesByBlog = async (req: Request, res: Response): Promise<any> => {
  const { blogId } = req.params;

  try {
    // Get all likes for a blog
    const likes = await prisma.like.findMany({
      where: { blogId: Number(blogId) },
      include: { user: true }, // Optionally, include user details
    });

    return res.status(200).json(likes);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};

// Check if a user has liked a blog
export const checkLikeByUser = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.userId; // Get the logged-in user
  const { blogId } = req.params; // Get the blogId from the params

  if (!userId) {
    return res.status(401).json({ error: "You must be logged in to check if you liked a blog." });
  }

  try {
    const existingLike = await prisma.like.findUnique({
      where: { userId_blogId: { userId, blogId: Number(blogId) } },
    });

    if (existingLike) {
      return res.status(200).json({ message: "You have liked this blog." });
    } else {
      return res.status(200).json({ message: "You have not liked this blog." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};
