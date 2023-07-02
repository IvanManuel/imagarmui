import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';
import { db } from '@/database';
import { IUser } from '@/interfaces';
import { User } from '@/models';

import { v2 as cloudinary } from "cloudinary";
cloudinary.config( process.env.CLOUDINARY_URL || '');


type Data = 
| { message: string }
| IUser[]
| IUser

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
        user.images = user.images!.map( image => { //TS arrojaba error de que user podiar venia vacío
            return image.includes('http') ? image : `${ process.env.HOST_NAME }/users/${ image }`
        });
        return user;
    })

    res.status(200).json( updatedUsers );


    return res.status(200).json( users );

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

