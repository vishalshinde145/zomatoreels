import FoodPartner from "../models/foodpartner.model.js";
import jwt from "jsonwebtoken";

async function registerFoodPartner(req, res) {
    try {
        if (!req.body) {
            return res.status(400).json({ "message": "Request body is missing." });
        }

        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({ "message": "All Fields are required!" });
        }

        const isUserAlreadyExist = await FoodPartner.findOne({ email });
        if (isUserAlreadyExist) {
            return res.status(400).json({ "message": "User already exists" });
        }

        const userId = await FoodPartner.create({ fullname, email, password });

        const token = jwt.sign({
            userId: userId
        }, process.env.JWT_SECRET || "60xT7P3pskNjQG1eFJ3Tk5");

        res.cookie("token", token);
        res.status(201).json({
            message: "User created successfully",
            userId, token
        })
    } catch (error) {
        console.error("Error in registerFoodPartner:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function loginFoodPartner(req, res) {
    try {
        if (!req.body) {
            return res.status(400).json({ "message": "Request body is missing." });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ "message": "All fields are required" });
        }

        const user = await FoodPartner.findOne({ email });

        if (!user) {
            return res.status(400).json({ "message": "User not found" });
        }
        if (user.password !== password) {
            return res.status(400).json({ "message": "Invalid password" });
        }

        const token = jwt.sign({
            userId: user.id,
        }, process.env.JWT_SECRET || "60xT7P3pskNjQG1eFJ3Tk5");

        res.cookie("token", token);

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email
            }, token
        });
    } catch (error) {
        console.error("Error in loginFoodPartner:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

function logoutFoodPartner(req, res) {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getFoodPartnerById(req, res) {
    try {
        const rows = await FoodPartner.getProfileData(req.params.id);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "FoodPartner not found" });
        }

        const foodpartner = {
            fullname: rows[0].fullname,
            email: rows[0].email,
            id: req.params.id
        };

        const videos = rows
            .filter(row => row.videoId !== null)
            .map(row => ({
                id: row.videoId,
                name: row.videoName,
                video: row.videoUrl,
                likes: row.likes
            }));

        res.status(200).json({
            message: "FoodPartner details and videos found successfully",
            foodpartner,
            videos
        });

    } catch (error) {
        console.error("Error in getFoodPartnerById:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export {
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner,
    getFoodPartnerById
}
