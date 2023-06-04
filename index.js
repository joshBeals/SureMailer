import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";

dotenv.config();
const app = express();

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
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });
    })
);

app.get("/", (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get("/protected", (req, res) => {
    res.send("Hello");
});

app.listen(5000, () => console.log("Listening on: 5000"));
