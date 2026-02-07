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

import { 
    User, 
    Settings, 
    Shield, 
    Mail, 
    AlertOctagon, 
    Menu, 
    X,
    ChevronRight
} from "lucide-react";

function EditProfilePage() {
    const [active, setActive] = useState("profile");
    const [openUpload, setOpenUpload] = useState(false);
    const [uploadType, setUploadType] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

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
            toast.error("Update failed. Please try again")
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
            toast.success("Username updated")
        } catch (error) {
            const message = error?.message ||  error?.response?.data?.message || "Something went wrong";
            toast.error(message)
        }
    }

    // Close mobile sidebar when a tab is selected
    const handleTabChange = (id) => {
        setActive(id);
        setIsSidebarOpen(false);
    };

    return (
        // Added pt-16 md:pt-20 to prevent header collision
        <div className="min-h-screen bg-slate-950 text-white pt-16 md:pt-24 pb-10 selection:bg-red-500/30">
            
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 px-4 md:px-6">

                {/* --- MOBILE MENU BUTTON --- */}
                <div className="md:hidden flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                        <span className="p-2 bg-slate-800 rounded-lg text-slate-400">
                           {active === 'profile' && <User size={20}/>}
                           {active === 'account' && <Settings size={20}/>}
                           {active === 'security' && <Shield size={20}/>}
                           {active === 'email' && <Mail size={20}/>}
                           {active === 'danger' && <AlertOctagon size={20}/>}
                        </span>
                        <span className="font-semibold capitalize">{active.replace('-', ' ')}</span>
                    </div>
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                {/* --- SIDEBAR (Desktop + Mobile Drawer) --- */}
                <Sidebar 
                    active={active} 
                    setActive={handleTabChange} 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)} 
                />

                {/* --- MAIN CONTENT AREA --- */}
                <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-xl min-h-[600px]">
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                </div>

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
