import userModel from "../models/user.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js"
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import generateDefaultAvatar from "../utils/avatar.util.js";
import path from "path";
import fs from "fs/promises";

// Setting cookie options
const cookieOptions = {
    maxAge: 7 * 60 * 60 * 1000, // Valid for 7 days
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
    secure: process.env.NODE_ENV === "Development" ? "false" : "true"
}

/**
 *  @REGISTER_USER
 *  @ROUTE @POST {{URL} /api/v1/auth/register}
 *  @ACESS (Public)
 */
const register = asyncHandler(async (req, res, next) => {

    console.log(req.body);
    const { username, email, password } = req.body;

    if(!username || !email || !password){
        return next(new AppError("All fields are mandatory", 400));
    }

    // check user exists already
    const userExists = await userModel.findOne({ email: email });

    if(userExists){
        return next(new AppError("Email already exists", 400));
    }

    // Create new user
    const user = await userModel.create({
        username,
        email,
        password,
        avatar: {
            public_id: 'dummy',
            secure_url: 'http://dummy.com'
        }
    });

    // Generate default avatar
    const defaultAvatar = await generateDefaultAvatar(username);

    // Create temporary file from the buffer
    const tempFilePath = path.join(process.cwd(), "temp_avatar.png");

    await fs.writeFile(tempFilePath, defaultAvatar);

    // Upload default avatar to the cloudinary
    try{
        const result = await cloudinary.v2.uploader.upload(tempFilePath, {
            folder: "Blog_Users",
            width: 250,
            height: 250,
            gravity: "faces",
            crop: "fill"
        });

        if(result){
            user.avatar.public_id = result.public_id;
            user.avatar.secure_url = result.secure_url;

            await user.save();
        }
    } catch (err){
        return next(new AppError("File uploading failed, please try again later.", 500));
    } finally {
        // Delete temporary file path
        fs.unlink(tempFilePath);
    }

    user.password = undefined;

    // Generating jwt token
    const token = await user.generateToken();

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
        success: true,
        message: "Registered successfully!",
        user
    });
})

export {
    register
}