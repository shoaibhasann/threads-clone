import express from "express";
import authRoutes from "./route/auth.route.js";
import userRoutes from "./route/user.route.js";
import postRoutes from "./route/post.route.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";

// load env variables
config();

// create an server instance of express
const app = express();

// Middleware for parsing request
app.use(express.json());

// parsing encoded url
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Middleware for parsing cookies
app.use(cookieParser());

// enable cors
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

// Handle authentication routes
app.use("/api/v1/auth", authRoutes);

// Handle user routes
app.use("/api/v1", userRoutes);

// Handle blog post routes
app.use("/api/v1/posts", postRoutes);

// Handle wildcard routes
app.all("*", (req, res) => {
  res.status(404).json("OOPS! Page Not Found");
});

// Middleware for error handling
app.use(errorMiddleware);

export default app;
