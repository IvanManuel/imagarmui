import mongoose, { Schema, model, Model } from "mongoose";
import { IUser } from '../interfaces';
import { boolean } from "yup";

const userSchema = new Schema({

    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100

    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    phone: {
        type: Number,
        required: true,
        minLength: [9, 'Must be 9 numbers'],
        maxLength: 10
    },
    images: [{ type: String }],
    bornedAt: { 
        type: String,
        required: true,
    },
    admin: { 
        type: Boolean, 
        required: true, 
        default: false 
    },
    coments: {
        type: String,
        required: true
    },
    privateComents: {
        type: String,
        default: ''
    }

}, {
    timestamps: true,
})

const User: Model<IUser> = mongoose.models.User || model('User', userSchema);

export default User;