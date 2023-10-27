import { Schema, model } from "mongoose";

const reactionSchema = new Schema({
  reaction: {
    type: String,
    enum: ["LIKE"],
  },
  reactedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
}, {
  timestamps: true
});

const reactionModel = model("Reaction", reactionSchema);

export default reactionModel;