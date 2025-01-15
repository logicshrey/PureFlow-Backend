import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
import { extractPublicId } from 'cloudinary-build-url';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {

        if(!localFilePath) {
            console.log("file not present");
            return null}  

        const response = await cloudinary.uploader.upload(localFilePath,{ resource_type:"auto" })
        
        fs.unlinkSync(localFilePath)
        return response
        
    } 
    catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

const deleteInCloudinary = async (fileUrl) => {

     try {
        if(!fileUrl) return null;
   
        const publicId = extractPublicId(fileUrl)
        const response = await cloudinary.uploader.destroy(publicId)
        
        return response;
     } 
     catch (error) {
        return null
     }

}


export { uploadOnCloudinary, deleteInCloudinary }