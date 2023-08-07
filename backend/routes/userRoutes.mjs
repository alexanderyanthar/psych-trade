import express from 'express';
import { signup, login, logout, getProfile } from '../controllers/userController.mjs';

const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', login);

router.get('/logout', logout);


router.post('/signup', signup);


router.get('/profile', getProfile);

export default router;