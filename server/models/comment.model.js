import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    text: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, {
    timestamps: true
});

const commentModel = model("Comment", commentSchema);

export default commentModel;