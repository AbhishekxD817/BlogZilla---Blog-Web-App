import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import 'dotenv/config'

const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 50
    },
    blogs: [
        {
            type: Schema.Types.ObjectId,
            ref: "Blog"
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();

    let salt = await bcrypt.genSalt(11);
    let hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    return next();
})

userSchema.methods.genToken = async function (_id) {
    const token = await jwt.sign({ payload: _id }, process.env.JWT_SECRET_KEY);
    return token;
}

const User = mongoose.model("User", userSchema);

export default User;