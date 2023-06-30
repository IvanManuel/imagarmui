import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';
import { db } from '@/database';
import { IUser } from '@/interfaces';
import { User } from '@/models';

import { v2 as cloudinary } from "cloudinary";
cloudinary.config( process.env.CLOUDINARY_URL || '');


type Data = 
| { message: string }
|  IUser[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'GET':
            return getUsers(req, res);

        case 'PUT':
            return updateUser(req, res);
    
        default:
            res.status(400).json({ message: 'Bad request' })
    }

}

const getUsers = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();
    const users = await User.find().select('-password').lean();
    await db.disconnect();

    const updatedUsers = users.map( user => {
        user.images = user.images.map( image => { //TS arrojaba error de que user podiar venia vacío, tuve que colocar !
            return image.includes('http') ? image : `${ process.env.HOST_NAME }/products/${ image }`
        });
        return user;
    })

    res.status(200).json( updatedUsers );


    return res.status(200).json( users );

}


const updateUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { userId = '', role = '' } = req.body;

    if( !isValidObjectId( userId ) ){
        return res.status(400).json({ message: 'No existe usuario con ese ID' })
    }

    const validRoles = [ 'admin' ];
    if ( !validRoles.includes(role) ){
        return res.status(400).json({ message: 'Rol no permitido: ' + validRoles.join(', ') })
    }

    await db.connect();
    const user = await User.findById( userId );
    if ( !user ){
        await db.disconnect();
        res.status(404).json({ message: 'Usuario no encontrado ' + userId });
    }

    user.images.forEach( async( image ) => {
        if( !images.includes(image) ){
            const [ fileId, extension ] = image.substring( image.lastIndexOf('/') + 1 ).split('.')
            console.log({ image, fileId, extension });
            await cloudinary.uploader.destroy( fileId );
        }
    })

    user!.role = role; //TS arrojaba error de que user podiar venia vacío, tuve que colocar !
    await user!.save();

    await db.disconnect();

    return res.status(200).json({ message: 'Usuario actualizado'})

}

