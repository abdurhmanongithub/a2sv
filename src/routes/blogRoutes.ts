import { Router } from "express";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  searchBlogs,
} from "../controllers/blogController";
import { storage } from "../utils/storage"; // Assume you have storage configured for file uploads
import multer from "multer";
import {
  createRating,
  updateRating,
  getRatingByBlogAndUser,
  getAverageRating,
  getRatingsByBlog,
} from "../controllers/blogRatingController";
import { 
  createComment, 
  updateComment, 
  deleteComment, 
  getCommentsByBlog, 
  getCommentByBlogAndUser 
} from "../controllers/commentController"; // Import controllers for comment operations

import { createLike, removeLike, getLikesByBlog, checkLikeByUser } from "../controllers/likeController"; // Import the controller functions


const upload = multer({ storage: storage });
const router = Router();

router.get("/", getAllBlogs); // Get all blogs
router.get("/:id", getBlogById); // Get blog by ID
router.post("/", upload.single("photo"), createBlog); // Create new blog
router.put("/:id", upload.single("photo"), updateBlog); // Update blog
router.delete("/:id", deleteBlog); // Delete blog
router.get("/search", searchBlogs); // Search blogs by title, content, or tags

router.post("/:blogId/rating", createRating); // Create a new rating
router.put("/:blogId/rating", updateRating); // Update an existing rating
router.get("/:blogId/rating", getRatingByBlogAndUser); // Get rating by blogId and userId
router.get("/:blogId/average-rating", getAverageRating); // Get average rating for a blog
router.get("/:blogId/ratings", getRatingsByBlog); // Get all ratings for a blog


router.post("/:blogId/comments", createComment);
router.put("/:blogId/comments/:commentId", updateComment);
router.delete("/:blogId/comments/:commentId", deleteComment);
router.get("/:blogId/comments", getCommentsByBlog);
router.get("/:blogId/comments/user", getCommentByBlogAndUser);


router.post("/:blogId/like", createLike); // Create a new like (Like a blog)
router.delete("/:blogId/like", removeLike); // Remove like (Unlike a blog)
router.get("/:blogId/likes", getLikesByBlog); // Get all likes for a blog
router.get("/:blogId/like-status", checkLikeByUser); // Check if a user has liked a blog


export default router;
