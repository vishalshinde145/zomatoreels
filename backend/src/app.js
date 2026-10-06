import express from 'express';
import authRoutes from '../routes/auth.routes.js';
import foodpartnerRoutes from '../routes/foodpartner.routes.js';
import foodRoutes from '../routes/food.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));


app.use((req, res, next) => {
    const origin = req.headers.origin || 'http://localhost:5173';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});


app.use('/', authRoutes);
app.use('/', foodpartnerRoutes);
app.use('/', foodRoutes);

export default app;