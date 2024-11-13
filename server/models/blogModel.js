import mongoose, { Schema } from 'mongoose';


const blogSchema = Schema({
    title: {
        type: String,
        required: true,
        max: 50
    },
    image:{
        type:String,
        default:"https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-4.0.3",
        set: (v) => v == "" ? "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-4.0.3": v
    },
    content: {
        type: String,
        required: true,
        max: 300
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, {
    timestamps: true
})


const Blog = mongoose.model("Blog", blogSchema);

export default Blog;