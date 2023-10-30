import asyncHandler from "../middleware/asyncHandler.middleware";

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

export { getRazorpayKey };
