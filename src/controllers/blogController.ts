import { Request, Response } from "express";
import { BlogModel } from "../models/BlogModel"; // Your BlogModel where Prisma queries are done
import prisma from "../utils/prisma"; // Prisma instance
import { JwtPayload } from "jsonwebtoken";

export const searchBlogs = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { query } = req.query; // Search query from request query parameters

  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "Invalid search query" });
  }

  try {
    // Use Prisma to search blogs directly by title or content
    const blogs = await BlogModel.getAllBlogs();

    const filteredBlogs = blogs.filter(
      (blog) => blog.title.includes(query) || blog.content.includes(query)
    );

    return res.status(200).json(filteredBlogs);
  } catch (error) {
    console.error("Error fetching blog", error); // Log the actual error
    return res
      .status(500)
      .json({ message: "Error fetching blog", error: error });
  }
};

// Create a new blog
export const createBlog = async (req: Request, res: Response): Promise<any> => {
  const { title, content } = req.body; // Assuming userId is passed to associate the blog

  try {
    const userId = req.user?.userId; // This should now work correctly without type errors

    if (!userId) {
      return res.status(400).json({ message: "User not acuthenticated" });
    }
    const blogData = {
      title,
      content,
      userId, // Make sure userId is provided and valid
      photo: req.file?.path, // Store photo if available
    };

    const newBlog = await BlogModel.createBlog(blogData); // Your createBlog method in BlogModel
    res.status(201).json({
      blog: newBlog,
      message: "Blog created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error });
  }
};

// Get all blogs (with pagination)
export const getAllBlogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1; // Default to page 1
  const limit = parseInt(req.query.limit as string) || 4; // Default to 10 items per page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
    const blogs = await prisma.blog.findMany({
      skip: startIndex,
      take: limit,
    });

    const totalItems = await prisma.blog.count();
    res.status(200).json({
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      blogs,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
};

// Get a blog by ID
export const getBlogById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const blogId = parseInt(req.params.id, 10);

  try {
    const blog = await BlogModel.getBlogById(blogId);
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error });
  }
};

// Update a blog
export const updateBlog = async (req: Request, res: Response): Promise<any> => {
  const blogId = parseInt(req.params.id, 10);

  const { title, content } = req.body;

  try {
    const blog = await BlogModel.getBlogById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    const userId = req.user?.userId; // This should now work correctly without type errors

    if (blog.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this blog" });
    }

    const updatedBlogData = {
      title,
      content,
      photo: req.file?.path, // Photo update if available
    };

    const updatedBlog = await BlogModel.updateBlog(blogId, updatedBlogData); // Your updateBlog method in BlogModel
    res.status(200).json({
      blog: updatedBlog,
      message: "Blog updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error });
  }
};

// Delete a blog
export const deleteBlog = async (req: Request, res: Response): Promise<any> => {
  const blogId = parseInt(req.params.id, 10);

  try {
    const blog = await BlogModel.getBlogById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    const userId = req.user?.userId; // This should now work correctly without type errors

    if (blog.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this blog" });
    }

    if (!blog) res.status(500).json({ message: "Blog not found" });
    const deletedBlog = await BlogModel.deleteBlog(blogId);
    res.status(200).json(deletedBlog);
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
};
