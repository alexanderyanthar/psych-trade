import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from 'bcrypt';
import { User } from "../models/user.mjs";

const configurePassport = () => {
    // Passport configuration
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) return done(null, false, { message: 'Incorrect username'});

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return done(null, false, { message: 'Incorrect password' });

            return done(null, user);
        } catch(err) {
            return done(err);
        }
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
}

export default configurePassport;