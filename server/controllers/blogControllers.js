import { populate } from 'dotenv';
import Blog from '../models/blogModel.js'
import uploadToCloudinary from '../utils/Cloudinary/cloudConfig.js';

export const allBlogs = async (req, res, next) => {
    let blogs = await Blog.find().populate('owner', 'name username').populate({
        path: "comments",
        select: "content owner",
        populate: {
            path: "owner",
            select: "name username"
        }
    });
    return res.json({
        blogs
    })
}
export const featuredBlogs = async (req, res, next) => {
    let blogs = await Blog.find().sort({ createdAt: -1 }).limit(10).populate('owner', 'name username');;
    return res.json({
        blogs
    })
}
export const createBlog = async (req, res, next) => {

    let imageUrl = '';
    if (req.files?.image?.path) {
        imageUrl = await uploadToCloudinary(req.files.image.path, "image");
    }


    let newBlog = await Blog({
        ...req.fields,
        image: imageUrl,
        owner: req.currentUser._id
    })

    await newBlog.save();
    // blog is created successfully

    // now push this blog to currentUser.blogs
    req.currentUser.blogs.push(newBlog._id);
    await req.currentUser.save();

    return res.json({
        message: "New Blog Created Successfully"
    })
}
export const updateBlog = async (req, res, next) => {
    let { id } = req.params;
    let { title, content } = req.fields;


    let imageUrl;
    if (req.files?.image?.path) {
        imageUrl = await uploadToCloudinary(req.files.image.path, "image");
    }

    if (imageUrl) {
        let blog = await Blog.findByIdAndUpdate(id, { image: imageUrl, title, content }, { new: true });
    } else {
        await Blog.findByIdAndUpdate(id, { title, content }, { new: true });
    }

    return res.json({
        message: "Blog Updated Successfully"
    })

}
export const deleteBlog = async (req, res, next) => {
    let { id } = req.params;
    let deletedBlog = await Blog.findByIdAndDelete(id);
    // now blog is successfully deleted

    // now delete it form currentUser.blogs
    let idx = req.currentUser.blogs.indexOf(deletedBlog._id);
    if (idx > -1) {
        req.currentUser.blogs.splice(idx, 1);
    }
    await req.currentUser.save();


    return res.json({
        message: "Blog Deleted Successfully",
        blog: deletedBlog
    })
}

