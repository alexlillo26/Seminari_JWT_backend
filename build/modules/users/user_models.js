import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        default: '0'
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: { type: String },
}, {
    versionKey: false,
    timestamps: true,
});
const User = mongoose.model('User', userSchema);
export default User;
