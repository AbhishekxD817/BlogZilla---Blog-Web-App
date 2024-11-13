import Joi from "joi";
import AppError from "../../ErrorHandlers/appError.js";

const SignUpSchema = Joi.object({
    name: Joi.string().required().min(3),
    username: Joi.string().alphanum().required().min(3),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().required().min(8).max(30)
}).required()

const LoginSchema = Joi.object({
    username: Joi.string().min(3),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().required().min(8)
}).or('username', 'email')
    .required();

export const SignUpSchemaValidator = async (req, res, next) => {
    try {
        await SignUpSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        const errorMessage = error.details?.map(detail => detail.message).join(" , ") || "Invalid input";
        return next(new AppError(400, errorMessage));
    }
};

export const LoginSchemaValidator = async (req, res, next) => {
    try {
        await LoginSchema.validateAsync(req.body);
        return next();
    } catch (error) {
        const errorMessage = error.details?.map(detail => detail.message).join(" , ") || "Invalid input";
        return next(new AppError(400, errorMessage));
    }
};