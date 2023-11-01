import asyncHandler from "../middleware/asyncHandler.middleware.js";
import userModel from "../model/user.model.js"

/**
 * @GET_API_KEY
 * @ROUTE @GET {{URL} /api/v1/purchase}
 * @ACCESS Authenticated
 */
const getRazorpayKey = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "API key successfully send",
        key: process.env.RAZORPAY_KEY_ID
    });
});

/**
 * @BUY_SUBSCRIPTION
 * @ROUTE @POST {{URL} /api/v1/purchase}
 * @ACCESS Authenticated
 */
const buySubscription = asyncHandler(async (req, res, next) => {
    const { id: userId } = req.user;

    const user = await userModel.findById(userId);

    if(!user){
        return next();
    }
});

/**
 * @CANCEL_SUBSCRIPTION
 * @ROUTE @GET {{URL} /api/v1/purchase/cancel-subscription}
 * @ACCESS Authenticated
 */
const cancelSubscription = asyncHandler(async (req, res, next) => {});


/**
 * @GET_ALL_SUBSCRIPTION
 * @ROUTE @GET {{URL} /api/v1/purchase/subscriptions}
 * @ACCESS Authenticated
 */
const getAllSubscription = asyncHandler(async (req, res, next) => {});

export { getRazorpayKey };
