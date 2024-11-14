import Blog from "../models/blogModel.js";
import Comment from "../models/commentModel.js";
import User from "../models/userModel.js";


export const getUserDetails = async (req, res, next) => {
    let currentUser = req.currentUser;
    let { id } = req.params;

    if (currentUser._id.equals(id)) {
        return res.json({
            user: currentUser
        })
    } else {
        let user = await User.findById(id).populate('blogs').populate('comments').select("-password -createdAt -updatedAt -email");
        return res.json({
            user
        })
    }

}

export const updateUserDetails = async (req, res, next) => {
    let updatedUser = await User.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true }).select("-password");
    return res.json({
        message: "User updated successfully",
        user: updatedUser
    })
}

export const deleteUserAccount = async (req, res, next) => {
    let { id } = req.params;

    let deletedUserAccount = await User.findByIdAndDelete(id);
    // user is deleted successfully

    // now after deleting user, we have to delete all blogs of user
    for (let i = 0; i < deletedUserAccount.blogs.length; i++) {
        let idxOfBlog = deletedUserAccount.blogs[i];
        await Blog.findByIdAndDelete(idxOfBlog);
    }

    // after deleting all blogs we have to delete user all comments
    for (let i = 0; i < deletedUserAccount.comments.length; i++) {
        let idxOfComment = deletedUserAccount.comments[i];
        await Comment.findByIdAndDelete(idxOfComment);
    }


    // now lets return the deleted user;
    return res.json({
        message: "User deleted successfully",
        user: deletedUserAccount
    })

}