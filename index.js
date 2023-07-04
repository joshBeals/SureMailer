import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";

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
        successRedirect: `${process.env.FRONTEND_URL}/auth/verifyGoogle`,
        failureRedirect: `${process.env.FRONTEND_URL}/auth/verifyGoogle`,
    })
);

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
