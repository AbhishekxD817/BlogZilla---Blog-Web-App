import mongoose, { Schema } from 'mongoose';

const commentSchema = Schema({
    content: {
        type: String,
        required: true,
        max: 50
    },
    blog: {
        type: Schema.Types.ObjectId,
        ref: "Blog"
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;

