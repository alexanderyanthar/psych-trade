// import bcrypt from 'bcrypt';
const bcrypt = require('bcrypt');
// import { User } from '../models/user.mjs'; // Import the User model
const User = require('../models/user');
// import passport from 'passport';
const passport = require('passport');

// Controller function for user login
const login = passport.authenticate('local', { successRedirect: '/profile', failureRedirect: '/login', failureMessage: true });

const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate({
            path: 'assessments',
            model: 'AssessmentAnswer',
        });

        const hasTakenAssessment = user.assessments.length > 0;
        let userPreference = '';

        if (hasTakenAssessment) {
            userPreference = user.assessments[0].userPreference;
        }

        res.render('profile', { username: user.username, hasTakenAssessment, userPreference });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).send('Internal Server Error');
    }
}

// Controller function for user logout
const logout = (req, res) => {
    req.logout((err) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Error logging out');
        }
    });
    res.redirect('https://delicate-babka-930147.netlify.app/');
};


// Route handler for signing up
const signup = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser =  await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already taken');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        req.login(newUser, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error creating user');
            }

            res.redirect('/profile');
        });
    } catch (err) {
        res.status(500).send('Error creating user');
    }
};

module.exports = { login, getProfile, logout, signup };
