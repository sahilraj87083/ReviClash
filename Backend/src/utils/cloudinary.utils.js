import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();


// configure cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const removeLocalFile = async (filePath) => {
    try {
        await fs.promises.unlink(filePath)
    } catch (_) {}
}

const uploadOnCloudinary = async (localFilePath) => {
    
    try {
        if(!localFilePath) return null;

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : 'auto'
        });

        // file has been uploaded successfully
        if (process.env.NODE_ENV !== 'production') {
            console.log("File uploaded to Cloudinary:", response.secure_url)
        }


        // Delete the temporary local file

        // WHY?
        
        // Because:

        // ✔ Multer (or your file uploader) saves the file temporarily on your server
        // ✔ After uploading to Cloudinary, you don’t need it anymore
        // ✔ Keeping local files bloats your server
        await removeLocalFile(localFilePath)

        return {
            secure_url: response.secure_url,
            public_id: response.public_id,
            resource_type: response.resource_type,
            duration: response.duration || null
        }

    } catch (error) {
        await removeLocalFile(localFilePath)
        console.error("Cloudinary upload error:", error.message)
        return null
    }
}

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        
        if (!publicId) return null;


        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });

        if(process.env.NODE_ENV !== 'production') {
            console.log('Asset deleted on Cloudinary')
        }
        return response;
    } catch (error) {
        console.log("Cloudinary delete error:", error);
        return null;
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}