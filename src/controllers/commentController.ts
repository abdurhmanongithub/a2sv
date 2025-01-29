import { Request, Response } from "express";
import prisma from "../utils/prisma";

// Create a new comment for a blog post
export const createComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { blogId } = req.params; // Extract blogId from the URL
  const { content } = req.body; // Get content of the comment
  const userId = req.user?.userId; // Get the userId from the authenticated user

  if (!userId) {
    return res.status(400).json({ error: "User not authenticated" });
  }

  try {
    // Create the new comment
    const newComment = await prisma.comment.create({
      data: {
        content,
        blogId: Number(blogId),
        userId,
      },
    });
    res.status(201).json(newComment); // Return the newly created comment
  } catch (error) {
    res.status(500).json({ error: "Error creating comment" });
  }
};

// Update an existing comment for a specific blog post
export const updateComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { blogId, commentId } = req.params; // Extract blogId and commentId from URL
  const { content } = req.body; // Get the new content of the comment
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ error: "User not authenticated" });
  }

  try {
    // Find the comment by ID
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    // Check if the comment exists and if it belongs to the logged-in user
    if (!comment || comment.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You can only edit your own comments" });
    }

    // Update the comment with the new content
    const updatedComment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: { content },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: "Error updating comment" });
  }
};

// Delete a comment for a specific blog post
export const deleteComment = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { blogId, commentId } = req.params; // Extract blogId and commentId from URL
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ error: "User not authenticated" });
  }

  try {
    // Find the comment by ID
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });

    // Check if the comment exists and if it belongs to the logged-in user
    if (!comment || comment.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own comments" });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: Number(commentId) },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting comment" });
  }
};

// Get all comments for a specific blog post
export const getCommentsByBlog = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { blogId } = req.params; // Extract blogId from URL

  try {
    // Fetch all comments for the blog post
    const comments = await prisma.comment.findMany({
      where: { blogId: Number(blogId) },
      include: {
        user: true, // Optionally include the user information (if needed)
      },
    });

    res.status(200).json(comments); // Return the list of comments
  } catch (error) {
    res.status(500).json({ error: "Error fetching comments" });
  }
};

// Get a comment by blogId and userId
export const getCommentByBlogAndUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { blogId } = req.params; // Extract blogId from URL
  const userId = req.user?.userId; // Get the userId from the authenticated user

  if (!userId) {
    return res.status(400).json({ error: "User not authenticated" });
  }

  try {
    // Fetch the comment by blogId and userId
    const comment = await prisma.comment.findMany({
      where: {
        userId: userId, // Match the userId
        blogId: Number(blogId), // Match the blogId
      },
      take: 1, // Take only the first matching comment
    });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Error fetching comment" });
  }
};
