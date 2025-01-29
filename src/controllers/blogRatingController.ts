import { Request, Response } from 'express';
import { BlogRatingModel } from '../models/blogRatingModel';

// Create a new rating for a blog
export const createRating = async (req: Request, res: Response): Promise<any> => {
  const { rating } = req.body;
  const { blogId } = req.params; // Get blogId from route parameters
  const userId = req.user?.userId; // Get userId from authenticated user

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    // Convert blogId to a number
    const blogIdNumber = parseInt(blogId, 10);
    if (isNaN(blogIdNumber)) {
      return res.status(400).json({ message: 'Invalid blogId' });
    }

    // Check if user has already rated the blog
    const existingRating = await BlogRatingModel.getRatingByBlogAndUser(blogIdNumber, userId);
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this blog' });
    }

    // Create the new rating
    const newRating = await BlogRatingModel.createRating(blogIdNumber, userId, rating);
    res.status(201).json({
      message: 'Rating created successfully',
      rating: newRating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating rating', error });
  }
};

// Update an existing rating for a blog
export const updateRating = async (req: Request, res: Response): Promise<any> => {
  const { rating } = req.body;
  const { blogId } = req.params; // Get blogId from route parameters
  const userId = req.user?.userId; // Get userId from authenticated user
  
  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    // Convert blogId to a number
    const blogIdNumber = parseInt(blogId, 10);
    if (isNaN(blogIdNumber)) {
      return res.status(400).json({ message: 'Invalid blogId' });
    }

    // Check if the rating exists
    const existingRating = await BlogRatingModel.getRatingByBlogAndUser(blogIdNumber, userId);
    if (!existingRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    // Update the rating
    const updatedRating = await BlogRatingModel.updateRating(blogIdNumber, userId, rating);
    res.status(200).json({
      message: 'Rating updated successfully',
      rating: updatedRating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating rating', error });
  }
};

// Get the rating for a blog by a specific user
export const getRatingByBlogAndUser = async (req: Request, res: Response): Promise<any> => {
  const { blogId } = req.params; // Get blogId from route parameters
  const userId = req.user?.userId; // Get userId from authenticated user

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    // Convert blogId to a number
    const blogIdNumber = parseInt(blogId, 10);
    if (isNaN(blogIdNumber)) {
      return res.status(400).json({ message: 'Invalid blogId' });
    }

    const rating = await BlogRatingModel.getRatingByBlogAndUser(blogIdNumber, userId);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found for this blog' });
    }

    res.status(200).json({
      message: 'Rating fetched successfully',
      rating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching rating', error });
  }
};

// Get the average rating for a specific blog
export const getAverageRating = async (req: Request, res: Response): Promise<any> => {
  const { blogId } = req.params; // Get blogId from route parameters

  try {
    // Convert blogId to a number
    const blogIdNumber = parseInt(blogId, 10);
    if (isNaN(blogIdNumber)) {
      return res.status(400).json({ message: 'Invalid blogId' });
    }

    const averageRating = await BlogRatingModel.getAverageRating(blogIdNumber);
    res.status(200).json({
      message: 'Average rating fetched successfully',
      averageRating,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching average rating', error });
  }
};

// Get all ratings for a specific blog
export const getRatingsByBlog = async (req: Request, res: Response): Promise<any> => {
  const { blogId } = req.params; // Get blogId from route parameters

  try {
    // Convert blogId to a number
    const blogIdNumber = parseInt(blogId, 10);
    if (isNaN(blogIdNumber)) {
      return res.status(400).json({ message: 'Invalid blogId' });
    }

    const ratings = await BlogRatingModel.getRatingsByBlog(blogIdNumber);
    res.status(200).json({
      message: 'Ratings fetched successfully',
      ratings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching ratings', error });
  }
};
