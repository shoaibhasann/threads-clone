import { Schema, model } from "mongoose";

const reactionSchema = new Schema({
  reaction: {
    type: Boolean,
    default: false
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