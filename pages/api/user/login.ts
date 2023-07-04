import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';

import { db } from '@/database'
import { User } from '@/models'
import { jwt } from '@/utils';


type Data = 
|   { message: string }
|   { 
    token: string;
    user: {
        email: string;
        firstName: string;
        admin: boolean;
    }
 }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'POST':
            return loginUser(req, res)
    
        default:
            res.status(409).json({
                message: 'Bad request'
            })
    }
}

const loginUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { email = '', password = '' } = req.body;

    await db.connect();
    const user = await User.findOne({ email });
    await db.disconnect();

    if ( !user ){
        return res.status(401).json({
            message: 'Correo no válido - EMAIL'
        })
    }

    if ( !bcrypt.compareSync( password, user.password! ) ){
        return res.status(402).json({
            message: 'Conntraseña no válida - PASSWORD'
        })
    }

    const token = jwt.signToken( user._id, email )
    const { _id, admin } = user;

    return res.status(200).json({
        token, _id, admin
    })

}
