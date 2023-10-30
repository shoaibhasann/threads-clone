import { config } from "dotenv";
import app from "./app.js";
import connectDatabase from "./config/db.js";
import cloudinary from "cloudinary";
import Razorpay from "razorpay";

// Load enviroment variables
config();

const port = process.env.PORT || 8000;

// Configured cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create instance of razorpay
export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.listen(port, async () => {
    // Connecting with DB
    await connectDatabase();
    console.log(`Server is listening on: http://localhost:${port}`);
});
