import { Router } from 'express';
import { LoginSchemaValidator, SignUpSchemaValidator } from '../utils/schema-validation/users/userSchemaValidator.js';
import { isAuthenticated, signup, login, logout } from '../controllers/authControllers.js';
import wrapAsync from '../utils/ErrorHandlers/wrapAsync.js'
const authRouter = Router();

authRouter.route("/")
    .post(wrapAsync(isAuthenticated))

authRouter.route("/signup")
    .post(
        wrapAsync(SignUpSchemaValidator),
        wrapAsync(signup))

authRouter.route("/login")
    .post(
        wrapAsync(LoginSchemaValidator),
        wrapAsync(login))

authRouter.route("/logout")
    .post(wrapAsync(logout))

export default authRouter;
