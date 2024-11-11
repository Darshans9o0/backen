import {v2 as cloudinary} from "cloudinary"
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.FILE_NAME,
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECREAT, 
});

const uploadOncloudnary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        // upload the file on cloudinary
         const response = await   cloudinary.uploader.upload(localFilePath , {
                resource_type : "auto"
            })
            // file has been upload succesfulluy
      //      console.log("file is uploaded on cloudinary",response.url);
      fs.unlinkSync(localFilePath)
          return response;

            
        
    } catch (error) {
      fs.unlinkSync(localFilePath) // remove the  locally saved temporary file as the 
      //  uploade operation failed 
      return null
    }
}

export{uploadOncloudnary}
