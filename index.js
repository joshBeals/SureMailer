import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import isLoggedIn from "./middlewares/isLoggedIn.js";

dotenv.config();
const app = express();

app.use(session({ secret: "cats" }));
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
        failureRedirect: `${process.env.FRONTEND_URL}/auth/failure`,
    })
);

app.get("/protected", isLoggedIn, (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
});

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));
