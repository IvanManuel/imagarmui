import { fileUpload } from "@/helpers";
import { setSaving, setPhotos } from '@/store/user';


export const startUploadingFiles = ( files = [] ) => {


    return async( dispatch ) => {        
        dispatch( setSaving());

        // await fileUpload( files[0] );

        const fileUploadPromises = [];
        for (const file of files) {
            fileUploadPromises.push( fileUpload( file ) )
        }

        const photosUrls = await Promise.all( fileUploadPromises );

        dispatch( setActiveUser ( photosUrls));
        
    }

}