// import express from 'express';
const express = require('express');
// import { signup, login, logout, getProfile } from '../controllers/userController.mjs';
const { signup, login, logout, getProfile } = require('../controllers/userController.js');

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

module.exports = router;