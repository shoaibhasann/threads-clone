import userModel from "../model/user.model.js";
import asyncHandler from "../middleware/asyncHandler.middleware.js";
import AppError from "../util/error.util.js";
import cloudinary from "cloudinary";
import generateDefaultAvatar from "../util/avatar.util.js";
import path from "path";
import fs from "fs/promises";
import emailTemplate from "../util/template.util.js";
import sendEmail from "../util/email.util.js";
import crypto from "crypto";

// Setting cookie options
const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // Valid for 7 days
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
  secure: process.env.NODE_ENV === "Development" ? "false" : "true",
};

/**
 *  @REGISTER
 *  @ROUTE @POST {{URL} /api/v1/auth/register}
 *  @ACESS (Public)
 */
const register = asyncHandler(async (req, res, next) => {
  const { fullname, username, email, password } = req.body;

  if (!fullname || !username || !email || !password) {
    return next(new AppError("All fields are mandatory", 400));
  }

  // check username exists already
  const usernameExists = await userModel.findOne({ username });

  if (usernameExists) {
    return next(new AppError("Username already exists", 400));
  }

  // check email exists already
  const emailExists = await userModel.findOne({ email });

  if (emailExists) {
    return next(new AppError("Email already exists", 400));
  }

  // Create new user
  const user = await userModel.create({
    fullname,
    username,
    email,
    password,
    avatar: {
      public_id: "dummy",
      secure_url: "http://dummy.com",
    },
  });

  // Generate default avatar
  const defaultAvatar = await generateDefaultAvatar(username);

  // Create temporary file from the buffer
  const tempFilePath = path.join(process.cwd(), "temp_avatar.png");

  await fs.writeFile(tempFilePath, defaultAvatar);

  // Upload default avatar to the cloudinary
  try {
    const result = await cloudinary.v2.uploader.upload(tempFilePath, {
      folder: "SpeakWave_Users",
      width: 250,
      height: 250,
      gravity: "faces",
      crop: "fill",
    });

    if (result) {
      user.avatar.public_id = result.public_id;
      user.avatar.secure_url = result.secure_url;

      await user.save();
    }
  } catch (err) {
    return next(
      new AppError("File uploading failed, please try again later.", 500)
    );
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
    user,
  });
});

/**
 *  @LOGIN
 *  @ROUTE @POST {{URL} /api/v1/auth/login}
 *  @ACESS (Public)
 */
const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError("All fields are mandatory", 400));
  }

  const userExists = await userModel.findOne({ username }).select("+password");

  if (!userExists) {
    return next(new AppError("Username doesn't exists", 400));
  }

  const comparePassword = await userExists.comparePassword(password);

  if (!comparePassword) {
    return next(
      new AppError("Password doesn't match, please enter correct password", 400)
    );
  }

  userExists.password = undefined;

  // Generate token
  const token = await userExists.generateToken();

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Loggedin successfully",
    user: userExists,
  });
});

/**
 *  @LOGOUT
 *  @ROUTE @GET {{URL} /api/v1/auth/logout}
 *  @ACESS (Public)
 */
const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
    secure: process.env.NODE_ENV === "Development" ? false : true,
    maxAge: 0,
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully!",
  });
});

/**
 *  @CHANGE_PASSWORD
 *  @ROUTE @PUT {{URL} /api/v1/auth/change-password}
 *  @ACESS (Public)
 */
const changePassword = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(new AppError("All fields are mandatory", 400));
  }

  if (oldPassword === newPassword) {
    return next(
      new AppError("Old password can't be same as the new password", 400)
    );
  }

  const userExists = await userModel.findById(id).select("+password");

  if (!userExists) {
    return next(new AppError("User not found", 400));
  }

  const passwordMatch = await userExists.comparePassword(oldPassword);

  if (!passwordMatch) {
    return next(new AppError("Old password is incorrect", 401));
  }

  userExists.password = newPassword;

  await userExists.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

/**
 *  @FORGOT_PASSWORD
 *  @ROUTE @POST {{URL} /api/v1/auth/forgot-password}
 *  @ACESS (Public)
 */
const forgotPassword = asyncHandler(async (req, res, next) => {

  const { email } = req.body;

  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  const emailExists = await userModel.findOne({ email });

  if (!emailExists) {
    return next(new AppError("Email doesn't exists", 400));
  }

  const resetToken = await emailExists.generatePasswordToken();

  await emailExists.save();

  const forgotPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const { subject, message } = emailTemplate(
    forgotPasswordURL,
    emailExists.fullname
  );

  try {
    await sendEmail(email, subject, message);

    res.status(200).json({
      success: true,
      message: `Email sent to ${emailExists.email} successfully`,
    });
  } catch (error) {
    emailExists.resetPasswordToken = undefined;
    emailExists.resetPasswordExpiry = undefined;

    await emailExists.save();

    return next(new AppError(error.message || "Error in sending email", 500));
  }
});

/**
 *  @RESET_PASSWORD
 *  @ROUTE @POST {{URL} /api/v1/auth/reset-password}
 *  @ACESS (Public)
 */
const resetPassword = asyncHandler(async (req, res, next) => {
  const { resetToken } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return next(new AppError("All fields are required", 400));
  }

  if (password !== confirmPassword) {
    return next(new AppError("Passwords don't match", 400));
  }

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordExpiry: { $gt: Date.now() },
  }).select("+password");

  if (!user) {
    return next(
      new AppError("Token is invalid or expired, please try again", 400)
    );
  }

  // Check if the new password is the same as the old password
  if (password === user.password) {
    return next(
      new AppError(
        "Please choose a different password. You have previously used this password.",
        400
      )
    );
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully!"
  })
})


export { register, login, logout, changePassword, forgotPassword, resetPassword };
