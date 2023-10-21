import AppError from "../utils/error.util.js";
import asyncHandler from "./asyncHandler.middleware.js";
import JWT from "jsonwebtoken";

// function to check authentication
const isLoggedIn = asyncHandler(async (req, res, next) => {

    const { token } = req.cookies;

    if(!token){
        return next(new AppError("Unauthenticated, please login again", 401));
    }

    const decodedToken = await JWT.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken;

    next();

});

export { 
    isLoggedIn
}