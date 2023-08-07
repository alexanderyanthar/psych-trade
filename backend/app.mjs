import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import crypto, { sign } from 'crypto';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from './models/user.mjs';
import { login, getProfile, logout, signup } from './controllers/userController.mjs';
import userRoutes from './routes/userRoutes.mjs';
import connectDB from './db.mjs';
import configurePassport from './config/passportConfig.mjs';

const app = express();
const PORT = 3000;
const secretKey = crypto.randomBytes(32).toString('hex');

await mongoose.connect('mongodb://127.0.0.1:27017/PsychTradeDB');



app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

configurePassport();

app.use('/', userRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
