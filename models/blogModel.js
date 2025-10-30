const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "title is required"],
        },
        description: {
            type: String,
            required: [true, "description is required"],
        },
        media: {
            type: String, // This can store either an image URL or a video URL
            required: [true, "media is required"],
        },
        mediaType: {
            type: String,
            enum: ["image", "video"], // restrict values
            default: "image", // default type
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "user id is required"],
        },
    },
    { timestamps: true }
);

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel;
