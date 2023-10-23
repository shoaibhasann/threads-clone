import userModel from "../models/user.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/error.util.js";

/**
 *  @EDIT_PROFILE
 *  @ROUTE @POST {{URL} /api/v1/me}
 *  @ACESS (Public)
 */
const getProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  const user = await userModel.findById(id);

  if (!user) {
    return next(new AppError("User not found", 400));
  }

  res.status(200).json({
    success: true,
    message: "Profile fetched successfully!",
    user,
  });
});

/**
 *  @EDIT_PROFILE
 *  @ROUTE @PUT {{URL} /api/v1/edit-profile}
 *  @ACESS (Public)
 */
const editProfile = asyncHandler(async (req, res, next) => {
})

export {
    getProfile,
    editProfile
}
