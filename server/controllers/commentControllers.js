import Blog from '../models/blogModel.js';
import Comment from '../models/commentModel.js'
import AppError from '../utils/ErrorHandlers/appError.js';

export const createComment = async (req, res, next) => {

    let { blogid } = req.params;

    // first check if blog exists or not
    let blog = await Blog.findById(blogid);
    if (!blog) {
        return next(new AppError(400, "Invalid Request"))
    }

    let newComment = await Comment({
        ...req.body,
        blog: blogid,
        owner: req.currentUser._id
    })
    await newComment.save();
    // now comment is created and saved

    // now we have to push it to currentUser.comments and blog.comments
    req.currentUser.comments.push(newComment._id);
    await req.currentUser.save();

    blog.comments.push(newComment._id);
    await blog.save();

    return res.json({
        message: "New Comment Added"
    })
}
export const updateComment = async (req, res, next) => {
    let { id } = req.params;
    let { content } = req.body;

    let updatedComment = await Comment.findByIdAndUpdate(id, { content }, { new: true });

    return res.json({
        message: "updated Comment successfully"
    })
}
export const deleteComment = async (req, res, next) => {
    let { id } = req.params;
    let deletedComment = await Comment.findByIdAndDelete(id);
    // comment is deleted from db

    // now delete comment from currentUser.comments
    let idxOfComment = req.currentUser.comments.indexOf(deletedComment._id);
    if (idxOfComment > -1) {
        req.currentUser.comments.splice(idxOfComment, 1);
        await req.currentUser.save();
    }

    // and blog.comments
    let blog = await Blog.findById(deletedComment.blog);
    idxOfComment = blog.comments.indexOf(deletedComment._id);
    if (idxOfComment > -1) {
        blog.comments.splice(idxOfComment, 1);
        await blog.save();
    }

    return res.json({
        message: "Comment Deleted Successfully",
        comment: deletedComment
    })
}