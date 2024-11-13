import { Router } from 'express';
import wrapAsync from '../utils/ErrorHandlers/wrapAsync.js'
import { allBlogs, createBlog, deleteBlog, featuredBlogs, updateBlog } from '../controllers/blogControllers.js';
import { blogSchemaValidator } from '../utils/schema-validation/blogs/blogSchemaValidator.js';
import { isBlogOwner, isLoggedIn } from '../middlewares/auth/auth.js'
import ExpressFormidable from 'express-formidable';


const blogsRouter = Router();



blogsRouter.route("/")
    .get(wrapAsync(allBlogs))
    .post(
        ExpressFormidable(),
        wrapAsync(isLoggedIn),
        wrapAsync(blogSchemaValidator),
        wrapAsync(createBlog))

blogsRouter.route("/:id")
    .put(
        ExpressFormidable(),
        wrapAsync(isLoggedIn),
        wrapAsync(isBlogOwner),
        wrapAsync(blogSchemaValidator),
        wrapAsync(updateBlog)
    )
    .delete(
        wrapAsync(isLoggedIn),
        wrapAsync(isBlogOwner),
        wrapAsync(deleteBlog)
    )

blogsRouter.route("/featured")
    .get(wrapAsync(featuredBlogs))

export default blogsRouter;
