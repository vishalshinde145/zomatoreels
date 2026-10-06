import express from 'express';
import path from 'path';
import app from './src/app.js';

// Serve static files from the "public" directory
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});