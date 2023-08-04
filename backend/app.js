import express from 'express';
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
    res.send(`Welcome, ${req.user.username}!`);
});

app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

app.listen(PORT,() => {
    console.log(`Server listening on port ${PORT}`);
});