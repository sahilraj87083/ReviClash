import { useState, useEffect} from "react";
import toast from "react-hot-toast";
import { updateCoverService, updateAvatarService } from "../services/auth.services";

const serviceMap = {
    avatar : updateAvatarService,
    coverImage : updateCoverService
}

export const useImageUpload = (type, onSuccess) => {
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);


    const selectFile = (file) => {
        setFile(file)
        setPreview(URL.createObjectURL(file));
    }

    const clearFile = () => {
        setFile(null)
        setPreview(null)
    }

    const upload = async () => {
        if(!file){
            toast.error("Please select an image");
            return;
        }

        const formData = new FormData()
        formData.append(type, file)
        try {
            
            if (!serviceMap[type]) {
                throw new Error(`Invalid upload type: ${type}`);
            }

            setLoading(true)
            
            const user = await serviceMap[type](formData)
            toast.success(`${type} updated successfully`);
            onSuccess?.(user);
            setFile(null)
            setPreview(null)
            return user;
        } catch (error) {
            toast.error(`Failed to update ${type}`);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }

    return {
        file,
        preview,
        loading,
        selectFile,
        clearFile,
        upload,
    };
}