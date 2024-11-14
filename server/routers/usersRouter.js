import { Router } from 'express';
import wrapAsync from '../utils/ErrorHandlers/wrapAsync.js';
import { isAccountOwner, isLoggedIn } from '../middlewares/auth/auth.js';
import { deleteUserAccount, getUserDetails, updateUserDetails } from '../controllers/userControllers.js';

const usersRouter = Router();

usersRouter.route("/:id")
    .get(
        wrapAsync(isLoggedIn),
        wrapAsync(getUserDetails)
    )
    .put(
        wrapAsync(isLoggedIn),
        wrapAsync(isAccountOwner),
        wrapAsync(updateUserDetails)
    )
    .delete(
        wrapAsync(isLoggedIn),
        wrapAsync(isAccountOwner),
        wrapAsync(deleteUserAccount)
    )


export default usersRouter;
