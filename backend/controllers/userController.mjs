import bcrypt from 'bcrypt';
import { User } from '../models/user.mjs'; // Import the User model
import passport from 'passport';

// Controller function for user login
export const login = passport.authenticate('local', { successRedirect: '/profile', failureRedirect: '/login', failureMessage: true });

export const getProfile = async (req, res) => {
    const { username } = req.user;
    console.log(username);
    res.render('profile', { username });
}

// Controller function for user logout
export const logout = (req, res) => {
    req.logout((err) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Error logging out');
        }
    });
    res.redirect('http://127.0.0.1:5501/frontend/');
};


// Route handler for signing up
export const signup = async (req, res) => {
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

