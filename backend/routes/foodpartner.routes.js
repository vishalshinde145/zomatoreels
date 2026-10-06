import express from 'express';
import { registerFoodPartner, loginFoodPartner, logoutFoodPartner, getFoodPartnerById } from '../controller/foodpartner.controller.js';

const router = express.Router();

router.post('/foodpartner/register', registerFoodPartner);
router.post('/foodpartner/login', loginFoodPartner);
router.get('/foodpartner/logout', logoutFoodPartner);
router.get('/foodpartner/:id', getFoodPartnerById);

export default router;
