import express from "express";
import userRoutes from "./routes/user.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";

// create an server instance of express
const app = express();

// Middleware for parsing request
app.use(express.json());

// Handle user routes
app.use("/api/v1/auth", userRoutes);

// Handle wildcard routes
app.all("*", (req, res) => {
    res.status(404).json("OOPS! Page Not Found")
});

// Middleware for error handling
app.use(errorMiddleware);

export default app;