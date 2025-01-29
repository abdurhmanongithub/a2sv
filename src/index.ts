import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import blogRoutes from "./routes/blogRoutes";
import authenticateToken from "./middleware/authMiddleware";
import authRoutes from "./routes/authRoutes";
dotenv.config();

const app = express();
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api/users", authenticateToken, userRoutes);
// app.use("/api/blogs", blogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
