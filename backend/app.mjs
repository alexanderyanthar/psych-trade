import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import crypto from 'crypto';

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

const User = mongoose.model('User', new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
}));

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
        if (err) return done(err);
        if(!user) return done(null, false, { message: 'Incorrect username.'});
        if(!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Incorrect password.'});
        }
        return done(null, user);
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

app.post('/login', passport.authenticate('local', { successRedirect: '/profile', failureRedirect: '/login'}));

app.get('/profile', (req, res) => {
    res.json(`Welcome, ${req.user.username}!`);
});

app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});



// Add a new route for handling signup
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if(existingUser) {
            return res.status(400).send('Username already taken');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        console.log('got it');
        res.status(201).send('User created successfully');
        // res.redirect('/login');
    } catch(err) {
        console.error(err);
        res.status(500).send('Error creating user');
    }
});


app.listen(PORT,() => {
    console.log(`Server listening on port ${PORT}`);
});