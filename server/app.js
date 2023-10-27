import express from "express";
import authRoutes from "./route/auth.route.js";
import userRoutes from "./route/user.route.js";
import postRoutes from "./route/post.route.js";
import commentRoutes from "./route/comment.route.js";
import reactionRoutes from "./route/reaction.route.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";

// create an server instance of express
const app = express();

// Middleware for parsing request
app.use(express.json());

// Middleware for parsing cookies
app.use(cookieParser());

// Handle authentication routes
app.use("/api/v1/auth", authRoutes);

// Handle user routes
app.use("/api/v1", userRoutes);

// Handle blog post routes
app.use("/api/v1/posts", postRoutes);

// Handle post comment routes
app.use("/api/v1/comment", commentRoutes);

// Handle post reaction routes
app.use("/api/v1/reaction", reactionRoutes);

// Handle wildcard routes
app.all("*", (req, res) => {
    res.status(404).json("OOPS! Page Not Found")
});

// Middleware for error handling
app.use(errorMiddleware);

export default app;