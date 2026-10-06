import { addFood, listFood, likefood } from "../controller/food.controller.js";
import { authFoodPartnerMiddleware, authUserMiddleware } from "../middlewares/auth.middleware.js";
import express from "express";
import multer from "multer";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
})

router.post('/add-food', upload.single("video"), addFood);
router.get('/list-food', listFood);
router.post('/like-food/:foodId', authUserMiddleware, likefood);

export default router;