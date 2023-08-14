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
import { Question } from './models/assessment.mjs';
import { AssessmentAnswer } from './models/assessmentAnswer.mjs';

const app = express();
const PORT = 3000;
const secretKey = crypto.randomBytes(32).toString('hex');

await mongoose.connect('mongodb://127.0.0.1:27017/PsychTradeDB');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + './../frontend'));


// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

configurePassport();

app.use('/', userRoutes);

app.get('/assessment', async (req, res) => {
    try {
        const questions = await Question.find().populate('options.points');
        console.log(req.user._id);

        res.render('assessment', { questions });
    } catch (err) {
        console.error('Error fetching assessment questions:', err);
        res.status(500).send('Iternal Server Error');
    }
});

app.post('/submitAssessment', async (req, res) => {
    console.log('Form submitted')
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);


        let fundamentalPoints = 0;
        let technicalPoints = 0;
        let hybridPoints = 0;
        let userPreference = '';

        for (const questionId in req.body) {
            const selectedOptionPoints = parseInt(req.body[questionId]);
            if (selectedOptionPoints === 1) {
                fundamentalPoints += 1;
            } else if (selectedOptionPoints === 2) {
                technicalPoints += 1;
            } else if (selectedOptionPoints === 3) {
                hybridPoints += 1;
            }
        }

        if (fundamentalPoints > technicalPoints && fundamentalPoints > hybridPoints) {
            userPreference = 'fundamental';
        } else if (technicalPoints > fundamentalPoints && technicalPoints > hybridPoints) {
            userPreference = 'technical';
        } else if (hybridPoints > fundamentalPoints && hybridPoints > technicalPoints || fundamentalPoints === technicalPoints) {
            userPreference = 'hybrid';
        } else if (fundamentalPoints === hybridPoints) {
            userPreference = 'hybrid-fundamnetal';
        } else if (technicalPoints === hybridPoints) {
            userPreference = 'hybrid-technical';
        }

        // console.log(`User preference: ${userPreference}`);
        // console.log(`Points - Fundamental: ${fundamentalPoints}, Technical: ${technicalPoints}, Hybrid: ${hybridPoints}`);

        const assessmentAnswers = new AssessmentAnswer({
            user: userId,
            userPreference: userPreference,
            assessmentResults: [
                {type: 'fundamental', points: fundamentalPoints},
                {type: 'technical', points: technicalPoints},
                {type: 'hybrid', points: hybridPoints},
            ]
        });

        await assessmentAnswers.save();

        user.assessments.push(assessmentAnswers);
        await user.save();

        res.redirect('/profile');
    } catch (err) {
        console.error('Error submitting assessment:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
