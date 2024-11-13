import Joi from 'joi'
import AppError from '../../ErrorHandlers/appError.js'

const BlogSchema = Joi.object({
    title: Joi.string().max(50).required(),
    content: Joi.string().min(5).max(300).required()
}).required()


export const blogSchemaValidator = async (req, res, next) => {
    try {
        await BlogSchema.validateAsync(req.fields);
        return next();
    } catch (error) {
        const errorMessage = error.details.map(detail => detail.message).join(" , ") || "Invalid Input";
        return next(new AppError(400, errorMessage));
    }
}