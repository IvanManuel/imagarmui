import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';

import { db } from '@/database'
import { User } from '@/models'
import { jwt, validations } from '@/utils';
import { isValidObjectId } from 'mongoose';

interface IRegister {
    firstName   : string;
    lastName    : string;
    email       : string;
    images      : string;
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
        case 'GET':
            return getUsers(req, res);

        case 'POST':
            return registerUser(req, res);

        case 'PUT':
            return updateUser(req, res);
    
        default:
            res.status(400).json({
                message: 'Bad request'
            })
    }

}

const getUsers = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();
    const users = await User.find().select('-password').lean();
    await db.disconnect();

    return res.status(200).json( users );

}

const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const {
        firstName,
        lastName,
        email,
        password,
        admin,
        phone,
        images,
        bornedAt,
        coments,
        privateComents,
    } = req.body as IRegister;

    if ( password.length < 8 ) {
        return res.status(401).json({
            message: 'La contraseña debe de ser de 8 caracteres o más'
        });
    }

    if ( firstName.length < 2 ) {
        return res.status(402).json({
            message: 'El nombre debe de ser de 2 caracteres'
        });
    }

    if( images.length > 1 ){
        return res.status(401).json({ message: 'Máximo una imagen' });
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
        images,
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
        user
    })

}

const updateUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { _id = '', images = [] } = req.body as IUser;

    console.log('DATAENAPI',req.body)

    if( !isValidObjectId( _id ) ){
        return res.status(401).json({ message: 'No existe usuario con ese ID' })
    }

    if( images.length > 1 ){
        return res.status(401).json({ message: 'Máximo una imagen' });
    }

    try {
        
        await db.connect();
        const user = await User.findById(_id);
        if( !user ){
            await db.disconnect();
            return res.status(402).json({ message: 'No existe usuario con ese ID' });
        }

        user.images!.forEach( async( image ) => {
            if( !images.includes(image) ){
                //Borrar de cloudinary
                const [ fileId, extension ] = image.substring( image.lastIndexOf('/') + 1 ).split('.')
                //console.log({ image, fileId, extension });
                await cloudinary.uploader.destroy( fileId );
            }
        })


        await user.updateOne( req.body );
        await db.disconnect();

        return res.status(200).json( user );

    } catch (error) {
        console.log({error})
        await db.disconnect();
        return res.status(403).json({ message: 'Revisar la consola del servidor' });
    }

}