import userModel from "../model/user.model.js";
import AppError from "../util/error.util.js";
import asyncHandler from "./asyncHandler.middleware.js";
import JWT from "jsonwebtoken";

// function to check authentication
const isLoggedIn = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthenticated, please login again", 401));
  }

  const token = authHeader.split(" ")[1];
  const decodedToken = JWT.verify(token, process.env.JWT_SECRET);

  req.user = decodedToken;
  next();
});


const authorizedRoles = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new AppError("Unauthorized access", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to access this route", 403)
      );
    }

    next();
  });


export { 
    isLoggedIn,
    authorizedRoles,
}
