import AppError from "../utils/ErrorHandlers/appError.js";
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'
import bcrypt from 'bcrypt';

const cookieOptions = {
    maxAge: 60 * 60 * 24 * 7 * 1000,
    secure: process.env.NODE_ENV == 'production',
    sameSite: process.env.NODE_ENV == 'production' ? 'None' : 'Lax',
    httpOnly: true,
    expired: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000)

}

const SendResponse = async (res, status, message) => {
    return res.status(status).json({
        message
    })
}

export const signup = async (req, res, next) => {
    console.log("signup fn() running...")

    // check if user with same email, or username already exists or not
    let userExists = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });
    if (userExists) {
        return next(new AppError(409, "user with the same username or email exists"));
    }

    // if not than create new user
    let newUser = await User({
        ...req.body
    });

    // save after creating
    await newUser.save();

    // set a jwt cookie for session management
    let cookieToken = await newUser.genToken(newUser._id);
    res.cookie('token', cookieToken, cookieOptions);

    return SendResponse(res, 200, "Singup Successfull");
}
export const login = async (req, res, next) => {
    console.log("login fn() running...")

    let { username, email, password } = req.body;

    // check if user exists or not
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
        return next(new AppError(409, "user not found"));
    }

    // user exists
    // validate password 
    let validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
        return next(new AppError(401, "Invalid Credentials"));
    }

    // now we confirmed that password is valid
    // set cookie token
    let token = await user.genToken(user._id);
    res.cookie('token', token, cookieOptions);

    return SendResponse(res, 200, "Login Successfull");
}
export const logout = async (req, res, next) => {
    console.log("logout fn() running...")

    res.clearCookie('token');
    return SendResponse(res, 200, 'Logout Successfull');

}
export const isAuthenticated = async (req, res, next) => {
    console.log("isAuthenticated fn() running...")

    if (!req.cookies || !req.cookies.token) {
        return next(new AppError(401, "No token found. Authentication required."))
    }

    let validateCookieToken = await jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    if (!validateCookieToken || !validateCookieToken.payload) {
        return next(new AppError(401, "Invalid Token"))
    }

    let user = await User.findById(validateCookieToken.payload).select("-password");
    if (!user) {
        return next(new AppError(404, "Invalid Token, No User Found"));
    }

    return res.json({
        Authenticated: true,
        message: "is Logged In",
        user
    })
}