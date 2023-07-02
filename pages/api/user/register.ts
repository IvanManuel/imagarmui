import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';

import { db } from '@/database'
import { User } from '@/models'
import { jwt, validations } from '@/utils';

interface IRegister {
    firstName   : string;
    lastName    : string;
    email       : string;
    password    : string;    
    admin       : boolean;
    phone       : string;    
    bornedAt    : string;
    coments     : string;
    privateComents: string;
}

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
            return registerUser(req, res)
    
        default:
            res.status(400).json({
                message: 'Bad request'
            })
    }

}

const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const {
        firstName,
        lastName,
        email,
        password,
        admin,
        phone,
        bornedAt,
        coments,
        privateComents,
    } = req.body as IRegister;

    if ( password.length < 6 ) {
        return res.status(401).json({
            message: 'La contraseña debe de ser de 6 caracteres o más'
        });
    }

    if ( firstName.length < 2 ) {
        return res.status(402).json({
            message: 'El nombre debe de ser de 2 caracteres'
        });
    }

    if ( !validations.isValidEmail( email ) ) {
        return res.status(403).json({
            message: 'Formato de correo inválido'
        });
    }

    await db.connect();
    const user = await User.findOne({ email });

    if ( user ) {
        return res.status(404).json({
            message: 'Este correo ya está registrado'
        })
    }

    const newUser = new User({
        firstName,
        lastName,
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync( password ),
        admin,
        phone,
        bornedAt,
        coments,
        privateComents,
    });

    try {
        
        await newUser.save({ validateBeforeSave: true });

    } catch (error) {
        console.log('ERROR REGISTER',error)
        return res.status(500).json({
            message: 'Debes revisar la cónsola'
        })
    }

    const { _id } = newUser;

    const token = jwt.signToken(_id, email )

    return res.status(200).json({
        token, //JWT
        user: {
            _id,
            firstName,
            lastName,
            email,
            admin,
            phone,
            bornedAt,
            coments,
            privateComents
        }
    })

}
