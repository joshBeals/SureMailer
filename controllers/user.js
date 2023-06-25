import User from "../models/User.js";

export const getUser = async (req, res) => {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user)
        res.status(400).json({ success: false, error: "User not found!" });
    res.status(200).json({ success: true, user });
};
