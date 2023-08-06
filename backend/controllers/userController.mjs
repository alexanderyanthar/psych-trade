import bcrypt from 'bcrypt';
import { User } from '../models/user.mjs'; // Import the User model
import passport from 'passport';

// Controller function for user login
export const login = passport.authenticate('local', { successRedirect: '/profile', failureRedirect: '/login' });

export const getProfile = async (req, res) => {
    const userObject = await req.body;
    const userParams = await req.params;
    console.log('user object', userObject, 'userparams', userParams);
    // res.render('profile', { user: req.user });
}

// Controller function for user logout
export const logout = (req, res) => {
    req.logOut();
    res.redirect('/');
};

// Import passport and User model

// ... (your other imports and setup) ...

// Route handler for signing up
export const signup = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already taken');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        // Log in the user manually after signing up
        req.login(newUser, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error creating user');
            }
            // Redirect the user to their profile page after signing up
            res.redirect('/profile');
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating user');
    }
};

