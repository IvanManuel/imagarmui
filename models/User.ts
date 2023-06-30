import mongoose, { Schema, model, Model } from "mongoose";
import { IUser } from '../interfaces';

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
    bornedAt: { //VERIFICAR QUE LOS DATOS VENGAN CON FORMATO DEL FRONTEND
        type: Date,
        required: true,
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'user'],
            message: '{VALUE} no es un  rol válido',
            default: 'client',
            required: true
        }
    },
    coments: {
        type: String,
        required: true
    },
    privateComents: {
        type: String
    }

}, {
    timestamps: true,
})

const User: Model<IUser> = mongoose.models.User || model('User', userSchema);

export default User;