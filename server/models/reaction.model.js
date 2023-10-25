import { Schema, model } from "mongoose";

const reactionSchema = new Schema({
  reaction: {
    type: String,
    enum: ["LIKE", "HEART", "LAUGH", "SUPPORT", "WOW", "SAD", "ANGRY"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const rectModel = model("Reaction", reactionSchema);

export default rectModel;