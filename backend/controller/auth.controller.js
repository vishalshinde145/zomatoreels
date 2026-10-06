import UserModel from '../models/usermodel.js';
// import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

async function registerUser(req, res) {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing. Ensure Content-Type is application/json." });
        }

        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isUserAlreadyExist = await UserModel.findOne({ email });
        if (isUserAlreadyExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const userId = await UserModel.create({ fullname, email, password });

        const token = jwt.sign({
            userId: userId,
        }, process.env.JWT_SECRET || "60xT7P3pskNjQG1eFJ3Tk5");

        res.cookie("token", token);

        res.status(201).json({ message: "User created successfully", userId, token });

    } catch (error) {
        console.error("Error in registerUser FULL ERROR:", error);
        res.status(500).json({ message: "Internal server error", error: error.message, stack: error.stack });
    }
}

async function loginUser(req, res) {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing." });
        }
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await UserModel.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid Email ID" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid Password" });
        }

        const token = jwt.sign({
            userId: user.id,
        }, process.env.JWT_SECRET);

        res.cookie("token", token);

        res.status(200).json({
            message: "Login successful",
            user: { id: user.id, fullname: user.fullname, email: user.email },
            token
        });

    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

function logoutUser(req, res) {
    try {
        res.clearCookie("token");
        res.status(200).json({ "message": "Logout successfully" });
    } catch (error) {
        console.error("Error in logoutUser Full Error: ", error);
        res.status(500).json({ "message": "Internal server error" });
    }
}


export { registerUser, loginUser, logoutUser };