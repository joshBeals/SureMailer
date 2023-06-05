import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import authRoutes from "./routes/auth.js";
import isLoggedIn from "./middlewares/isLoggedIn.js";

dotenv.config();
const app = express();

app.use(session({ secret: 'cats' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "/protected",
        failureRedirect: "/auth/failure",
    })
);

app.get("/protected", isLoggedIn, (req, res) => {
    res.send("Hello");
});

/* ROUTES */
app.use("/auth", authRoutes);

app.listen(5000, () => console.log("Listening on: 5000"));
