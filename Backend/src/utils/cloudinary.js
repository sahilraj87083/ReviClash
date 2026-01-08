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

const uploadOnCloudinary = async (localFilePath) => {
    
    try {
        if(!localFilePath) return null;

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : 'auto'
        });

        // file has been uploaded successfully
        console.log("file is uploaded on cloudinary ", response.url);

        // Delete the temporary local file

        // WHY?
        
        // Because:

        // ✔ Multer (or your file uploader) saves the file temporarily on your server
        // ✔ After uploading to Cloudinary, you don’t need it anymore
        // ✔ Keeping local files bloats your server
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        console.log("UPLOAD ERROR:", error); 
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deleteFromCloudinary = async (asset) => {
    try {
        
        if (!asset) return null;

        let publicId;

        // If it's a URL, extract public_id
        // Extract the public ID from the URL
        // Example:
        // https://res.cloudinary.com/demo/image/upload/v1234567/abcxyz.png
        // public_id = "abcxyz"
        if (asset.includes("/")) {
            publicId = asset.split("/").pop().split(".")[0];
        } 
        // Else assume it's already a public_id
        else {
            publicId = asset;
        }

        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: "auto"
        });
        
        console.log('Asset deleted on Cloudinary')
        return response;
    } catch (error) {
        console.log("Cloudinary delete error:", error);
        return null;
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}