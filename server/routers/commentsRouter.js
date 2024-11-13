import { Router } from 'express';
import wrapAsync from '../utils/ErrorHandlers/wrapAsync.js';
import { createComment, updateComment, deleteComment } from '../controllers/commentControllers.js';
import { isLoggedIn } from '../middlewares/auth/auth.js';

const commentsRouter = Router();

commentsRouter.route("/blog/:blogid")
    .post(
        wrapAsync(isLoggedIn),
        wrapAsync(createComment));

commentsRouter.route("/:id")
    .put(
        wrapAsync(isLoggedIn),
        wrapAsync(updateComment))
    .delete(
        wrapAsync(isLoggedIn),
        wrapAsync(deleteComment))


export default commentsRouter;
