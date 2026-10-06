import { FoodModel } from "../models/food.model.js";
import { upLoadFile } from "../services/storage.services.js";
import { v4 as uuid } from "uuid";

async function addFood(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded. Please upload a video file."
            });
        }
        const fileuploadresult = await upLoadFile(req.file.buffer, uuid());

        const foodItem = await FoodModel.addFood({
            name: req.body.name,
            video: fileuploadresult.url,
            foodPartnerId: req.body.foodPartnerId
        });
        return res.status(200).json({
            success: true,
            message: "Food added successfully",
            data: foodItem
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to add food",
            error: error.message
        })
    }
}

async function listFood(req, res) {
    try {
        const rows = await FoodModel.getAllFood();
        if (!rows) {
            return res.status(404).json({
                success: false,
                message: "No food found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Food list",
            data: rows
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to list food",
            error: error.message
        })
    }
}

async function likefood(req, res) {
    try {
        const { foodId } = req.params;
        const userId = req.user?.id || req.body.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User ID is required"
            });
        }

        const alreadyLiked = await FoodModel.hasUserLiked(userId, foodId);

        if (alreadyLiked) {
          const response = await FoodModel.unlikeFood(userId, foodId);
          return res.status(200).json({
            success: true,
            liked: false,
            message: response.message,
            data: response
          });
        }

        const result = await FoodModel.likeFood(userId, foodId);

        return res.status(200).json({
            success: true,
            liked: true,
            message: "Food liked successfully",
            data: result
        });
    }catch(error){
            return res.status(500).json({
                success:false,
                message:"Failed to like food",
                error:error.message
            })
        }              
    }
export { addFood, listFood, likefood }
