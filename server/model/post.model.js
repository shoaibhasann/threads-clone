import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {

    content: {
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
        type: Schema.Types.ObjectId,
        ref: "Reaction",
      },
    ],

    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
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

    numberOfComments: {
      type: Number,
      default: 0,
      min: 0,
    },

    numberOfReactions: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const postModel = model("Post", postSchema);

export default postModel;