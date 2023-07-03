import mongoose from "mongoose";
import findOrCreate from "mongoose-findorcreate";

const UserSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        lastname: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        oauth: {
            type: Boolean,
            default: false,
        },
        googleId: {
            type: String,
            default: null,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: function () {
                return !this.oauth;
            },
            min: 50,
            default: null,
        },
    },
    { timestamps: true }
);

UserSchema.plugin(findOrCreate);

const User = mongoose.model("User", UserSchema);
export default User;