import { Router } from "express";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
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

const upload = multer({ storage: storage });
const router = Router();

router.get("/", getAllBlogs); // Get all blogs
router.get("/:id", getBlogById); // Get blog by ID
router.post("/", upload.single("photo"), createBlog); // Create new blog
router.put("/:id", upload.single("photo"), updateBlog); // Update blog
router.delete("/:id", deleteBlog); // Delete blog

router.post("/:blogId/rating", createRating); // Create a new rating
router.put("/:blogId/rating", updateRating); // Update an existing rating
router.get("/:blogId/rating", getRatingByBlogAndUser); // Get rating by blogId and userId
router.get("/:blogId/average-rating", getAverageRating); // Get average rating for a blog
router.get("/:blogId/ratings", getRatingsByBlog); // Get all ratings for a blog

export default router;
