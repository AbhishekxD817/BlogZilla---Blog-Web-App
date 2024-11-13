import AppError from "../../utils/ErrorHandlers/appError.js"
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import User from "../../models/userModel.js"
import Blog from "../../models/blogModel.js"
import Comment from "../../models/commentModel.js"

export const isLoggedIn = async (req, res, next) => {
    console.log("is logged in running...")
    if (!req.cookies || !req.cookies.token) {
        return next(new AppError(401, "No token found. Authentication required."))
    }

    let validateCookieToken = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    if (!validateCookieToken || !validateCookieToken.payload) {
        return next(new AppError(401, "Invalid Token, Authentication Required"))
    }

    let user = await User.findById(validateCookieToken.payload).select("-password");
    if (!user) {
        return next(404, "Invalid token, no user found");
    }

    req.currentUser = user;
    return next();
}

export const isBlogOwner = async (req, res, next) => {
    let { id } = req.params;
    let blog = await Blog.findById(id);

    if (!blog.owner.equals(req.currentUser._id)) {
        return next(new AppError(403, "Access Denied"));
    }

    return next();
}

export const isCommentOwner = async (req, res, next) => {
    let { id } = req.params;
    let comment = await Comment.findById(id);

    if (!comment.owner.equals(req.currentUser._id)) {
        return next(new AppError(403, "Access Denied"));
    }

    return next();
}