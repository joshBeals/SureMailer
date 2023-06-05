import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import dotenv from "dotenv";
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
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return done(err, user);
        // });
        return done(err, profile);
    })
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

const router = express.Router();

router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
    "/failure",
    (req, res) => {
        res.send('Something went wrong');
    }
);

router.get(
    "/logout",
    (req, res) => {
        req.logout();
        req.session.destroy();
        res.send('Goodbye!');
    }
);

export default router;
