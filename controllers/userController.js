const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
//create user register user
exports.registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        //validation
        if (!username || !email || !password) {
            return res.status(400).send({
                success: false,
                message: "Please Fill all fields",
            });
        }
        //exisiting user
        const exisitingUser = await userModel.findOne({ email });
        if (exisitingUser) {
            return res.status(409).send({
                success: false,
                message: "user already exisits",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        //save new user
        const user = new userModel({ username, email, password: hashedPassword });
        await user.save();
        const safeUser = { _id: user._id, username: user.username, email: user.email };
        return res.status(201).send({
            success: true,
            message: "New User Created",
            user: safeUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error In Register callback",
            success: false,
            error,
        });
    }
};

// get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select("username email createdAt updatedAt");
        return res.status(200).send({
            userCount: users.length,
            success: true,
            message: "all users data",
            users,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Get ALl Users",
            error,
        });
    }
};

//login
exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Please provide email or password",
            });
        }
        const user = await userModel.findOne({ email }).select("+password username email");
        if (!user) {
            return res.status(404).send({ success: false, message: "Email is not registered" });
        }
        //password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: "Invalid email or password",
            });
        }
        const safeUser = { _id: user._id, username: user.username, email: user.email };
        return res.status(200).send({ success: true, message: "login successfully", user: safeUser });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Login Callcback",
            error,
        });
    }
};