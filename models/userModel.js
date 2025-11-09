const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "username is required"],
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
            select: false,
        },
        blogs: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Blog",
            },
        ],
    },
    { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;