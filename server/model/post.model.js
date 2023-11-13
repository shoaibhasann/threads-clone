import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {

    content: {
      type: String,
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

    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default : []
    },

    replies: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        text: {
          type: String
        },
        userAvatar: {
          type: String
        },
        username: {
          type: String
        },
        repliedAt: {
          type: Date
        }
      },
    ],

    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    numberOfRepost: {
      type: Number,
      default: 0,
      min: 0
    },

  },
  {
    timestamps: true,
  }
);

const postModel = model("Post", postSchema);

export default postModel;
