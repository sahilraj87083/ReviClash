import { useState } from "react";
import {
    ProfileSideBar as Sidebar,
    ProfileSection,
    AccountSection,
    SecuritySection,
    EmailSection,
    DangerZone,
    ImageUploadModal
} from "../components";
import { useUserContext } from "../contexts/UserContext";
import { updateAccountDetailsService , changeCurrentPasswordService, updateUserNameService} from "../services/auth.services";
import toast from "react-hot-toast";

function EditProfilePage() {
    const [active, setActive] = useState("profile");
    const [openUpload, setOpenUpload] = useState(false);
    const [uploadType, setUploadType] = useState(null);

    const { setUser, logout } = useUserContext();

    const openUploader = (type) => {
        setUploadType(type); // "avatar" | "coverImage"
        setOpenUpload(true);
    };

    const updateDetails = async (data) => {
        try {
            const user = await updateAccountDetailsService(data)
            setUser(user);
        } catch (error) {
            toast.error("Updation failed. Please try again")
            throw error;
        }
    }
    
    const updatePassword = async (data) => {
        try {
            await changeCurrentPasswordService(data)
            logout()
        } catch (error) {
            toast.error("Invalid Old password")
            throw error;
        }
    }

    const updateUserName = async ( data ) => {
        try {
            const user = await updateUserNameService(data)
            setUser(user)
            toast.success("username updated")
        } catch (error) {
            const message = error?.message ||  error?.response?.data?.message || "Something went wrong";
            toast.error(message)
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white flex">

            <Sidebar active={active} setActive={setActive} />

            <div className="flex-1 p-10 max-w-4xl">

                {active === "profile" && (
                    <ProfileSection 
                        onOpenUpload={openUploader} 
                        updateDetails = {updateDetails}
                    />
                )}

                {active === "account" && (<AccountSection updateUserName = {updateUserName} />)}
                {active === "security" && <SecuritySection  updatePassword = {updatePassword} />}
                {active === "email" && <EmailSection />}
                {active === "danger" && <DangerZone />}
            </div>

            <ImageUploadModal
                open={openUpload}
                type={uploadType}
                onClose={() => setOpenUpload(false)}
                onSuccess={(user) => setUser(user)}
            />
        </div>
    );
}

export default EditProfilePage;
