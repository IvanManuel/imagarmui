import { IUser } from '@/interfaces';
import { db } from './';
import { User } from '@/models';
import bcrypt from 'bcryptjs';
import { isValidObjectId } from "mongoose";


export const checkUserEmailPassword = async( email: string = '', password: string= '' ) => {

    await db.connect;
    const user = await User.findOne({ email }).lean();
    await db.disconnect;

    if ( !user ) {
        return null;
    }

    if ( !bcrypt.compareSync( password, user.password! ) ) {
        return null;
    }

    const { admin, firstName, _id } = user;

    return {
        id: _id,
        email: email.toLocaleLowerCase(),
        admin,
        firstName,
    }

}

export const getUserById = async( id: string ): Promise<IUser | null> => {

    if ( !isValidObjectId(id) ){
        return null;
    }

    await db.connect();
    const user = await User.findById( id ).lean();
    await db.disconnect();

    if ( !user ){
        return null;
    }

    return JSON.parse(JSON.stringify(user));

}

interface UserId {
    phone: string;
}
