import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { login, register } from "../controllers/auth.js";
import User from "../models/User.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

dotenv.config();

// Configure OAuth provider credentials
const oauthProviderConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
};

passport.use(
    new GoogleStrategy(oauthProviderConfig, function (
        request,
        accessToken,
        refreshToken,
        profile,
        done
    ) {
        User.findOrCreate(
            { googleId: profile.id },
            {
                oauth: true,
                firstname: profile.given_name,
                lastname: profile.family_name,
                email: profile.email,
            },
            function (err, user) {
                return done(err, user);
            }
        );
    })
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get("/success", isLoggedIn, (req, res) => {
    const user = req?.user;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ success: true, token, user });
});

router.get("/failure", (req, res) => {
    res.status(500).json({ success: false, error: "Authentication Failed!" });
});

router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.session.destroy();
        res.send("Goodbye!");
    });
});

export default router;
