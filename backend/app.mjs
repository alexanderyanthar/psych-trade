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

// Passport configuration
passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'Incorrect username.' });
        if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.get('/signup', (req, res) => {
    res.render('signup');
})


app.post('/profile', async (req, res) => {
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
})


app.get('/profile', (req, res) => {
    const { username } = req.user;
    console.log(username);
    res.render('profile', { username });
})


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
