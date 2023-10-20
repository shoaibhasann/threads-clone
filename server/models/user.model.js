import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {

    username: {
      type: String,
      required: true,
      trim: true,
      minLength: [5, "username must be at least 5 characters long"],
      maxLength: [20, "username cannot be more than 20 characters long"],
    },

    email: {
      type: String,
      required: true,
      unique: [true, "email must be unique"],
      trim: true,
      lowercase: true,
      match: [
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        "Invalid email format",
      ],
    },

    password: {
      type: String,
      required: true,
      select: false,
      minLength: [8, "password must be at least 8 characters long"],
    },

    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },

    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },

    subscription: {
      id: String,
      status: String,
    },

    resetPasswordToken: String,
    resetPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

// Pre save middleware for password hashing
userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        return next();
    }

    try{
        const hashedPassword = await bcrypt.hash(this.password, 10);

        this.password = hashedPassword;
        next();
    } catch (err){
        return next(err);
    }
})

const userModel = model("User", userSchema);

export default userModel;
