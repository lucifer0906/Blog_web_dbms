const mongoose = require("mongoose");
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
const cloudinary = require("../utils/cloudinary");

// ✅ GET ALL BLOGS
exports.getAllBlogsController = async (req, res) => {
    try {
        const blogs = await blogModel.find({}).populate("user");
        if (!blogs || blogs.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No blogs found",
            });
        }
        return res.status(200).send({
            success: true,
            BlogCount: blogs.length,
            message: "All blogs list",
            blogs,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while getting blogs",
            error,
        });
    }
};

// ✅ CREATE BLOG
exports.createBlogController = async (req, res) => {
    try {
        const { title, description, media, mediaType, user, coverImage } = req.body;
        if (!title || !description || !user || (!media && !coverImage)) {
            return res.status(400).send({
                success: false,
                message: "Provide title, description, user and either media URL or cover image",
            });
        }

        const existingUser = await userModel.findById(user);
        if (!existingUser) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        const newBlog = new blogModel({
            title,
            description,
            media,
            mediaType,
            coverImage, // optional
            user,
        });

        const session = await mongoose.startSession();
        session.startTransaction();
        await newBlog.save({ session });
        existingUser.blogs.push(newBlog);
        await existingUser.save({ session });
        await session.commitTransaction();

        return res.status(201).send({
            success: true,
            message: "Blog created successfully",
            newBlog,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while creating blog",
            error,
        });
    }
};

// ✅ UPDATE BLOG (⚙️ Fixed section)
exports.updateBlogController = async (req, res) => {
    try {
        const { id } = req.params;
    const { title, description, media, mediaType, coverImage } = req.body;

        // Prevent clearing both media and coverImage
        if (!media && !coverImage) {
            return res.status(400).send({
                success: false,
                message: "At least one of media or coverImage must be provided",
            });
        }
        const blog = await blogModel.findByIdAndUpdate(id, { title, description, media, mediaType, coverImage }, { new: true });

        if (!blog) {
            return res.status(404).send({
                success: false,
                message: "Blog not found",
            });
        }

        return res.status(200).send({
            success: true,
            message: "Blog updated successfully",
            blog,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while updating blog",
            error,
        });
    }
};

// ✅ GET SINGLE BLOG
exports.getBlogByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blogModel.findById(id);
        if (!blog) {
            return res.status(404).send({
                success: false,
                message: "Blog not found with this ID",
            });
        }
        return res.status(200).send({
            success: true,
            message: "Fetched single blog successfully",
            blog,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while getting single blog",
            error,
        });
    }
};

// ✅ DELETE BLOG
exports.deleteBlogController = async (req, res) => {
    try {
        const blog = await blogModel.findByIdAndDelete(req.params.id).populate("user");

        if (!blog) {
            return res.status(404).send({
                success: false,
                message: "Blog not found",
            });
        }

        await blog.user.blogs.pull(blog);
        await blog.user.save();

        return res.status(200).send({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while deleting blog",
            error,
        });
    }
};

// ✅ GET USER BLOGS
exports.userBlogController = async (req, res) => {
    try {
        const userBlog = await userModel.findById(req.params.id).populate("blogs");

        if (!userBlog) {
            return res.status(404).send({
                success: false,
                message: "No blogs found for this user",
            });
        }

        return res.status(200).send({
            success: true,
            message: "User blogs fetched successfully",
            userBlog,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in user blog controller",
            error,
        });
    }
};

// ✅ IMAGE UPLOAD CONTROLLER (Cloudinary)
exports.uploadImageController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ success: false, message: "No file uploaded" });
        }

        // Convert buffer to Data URI for Cloudinary upload
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataUri = `data:${req.file.mimetype};base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataUri, {
            folder: "blog-app",
            resource_type: "image",
        });

        return res.status(200).send({ success: true, message: "Image uploaded", url: result.secure_url });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Error while uploading image", error: error?.message || error });
    }
};
