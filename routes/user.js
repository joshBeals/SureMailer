import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { getUser } from "../controllers/user.js";

const router = express.Router();

router.get("/", verifyToken, getUser);

export default router;
