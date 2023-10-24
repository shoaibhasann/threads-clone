import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {

    title: {
      type: String,
      required: true,
      trim: true, 
      maxLength: 100, 
    },

    description: {
      type: String,
      required: true,
      maxLength: 1000,
    },

    thumbnail: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },

    reactions: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            type: {
                type: String,
                enum: ["LIKE", "HEART", "LAUGH", "SUPPORT", "WOW", "SAD"]
            }
        }
    ],

    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
          maxLength: 200, // Max length of 200 characters for comments
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const postModel = model("POST", postSchema);

export default postModel;