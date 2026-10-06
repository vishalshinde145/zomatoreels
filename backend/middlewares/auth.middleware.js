import jwt from "jsonwebtoken";
import db from "../config/database.js";

const JWT_SECRET = process.env.JWT_SECRET;

export async function authFoodPartnerMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please login first",
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const partnerId = decoded.userId || decoded.id;

        const [rows] = await db.query("SELECT * FROM foodpartner WHERE id = ?", [partnerId]);
        const foodPartner = rows[0];

        if (!foodPartner) {
            return res.status(401).json({
                message: "Food partner not found"
            });
        }

        req.foodPartner = foodPartner;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}

export async function authUserMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId || decoded.id;

        const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}
