import { useUserContext } from "../../contexts/UserContext";
import toast from "react-hot-toast";
import { useState } from "react";
import { Input, Button } from '../'; // Assuming Button is available
import { Camera, Save } from "lucide-react";

function ProfileSection({ onOpenUpload, updateDetails}) {
    const { user } = useUserContext();
    const [fullName, setFullName] = useState(user.fullName || "");
    const [bio, setBio] = useState(user.bio || "");
    const [loading, setLoading] = useState(false);

    const HandleSave = async () => {
        if (loading) return;
        setLoading(true);
        await updateDetails({ fullName, bio });
        toast.success("Profile updated");
        setLoading(false);
    };
    const changeDetected = fullName != user.fullName || bio != user.bio 

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-4">Public Profile</h2>

            {/* Visuals Section */}
            <div className="space-y-6">
                
                {/* Cover Image */}
                <div className="group relative h-40 md:h-52 w-full rounded-2xl bg-slate-800 overflow-hidden border border-slate-700">
                    {user.coverImage?.url ? (
                        <img src={user.coverImage.url} className="w-full h-full object-cover" alt="cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-center text-slate-600 text-sm">
                            No cover image
                        </div>
                    )}
                    
                    <button
                        onClick={() => onOpenUpload("coverImage")}
                        className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-2 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                    >
                        <Camera size={14} /> Change Cover
                    </button>
                </div>

                {/* Avatar */}
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 px-4 md:px-8">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-full border-[6px] border-slate-900 bg-slate-800 overflow-hidden">
                             {user.avatar?.url ? (
                                <img src={user.avatar.url} className="w-full h-full object-cover" alt="avatar" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-500">{user.username[0]}</div>
                            )}
                        </div>
                        <button
                            onClick={() => onOpenUpload("avatar")}
                            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-[6px] border-transparent"
                        >
                            <Camera size={24} />
                        </button>
                    </div>

                    <div className="flex-1 text-center md:text-left pb-2">
                        <h3 className="text-xl font-bold text-white">{user.username}</h3>
                        <p className="text-sm text-slate-400">Update your photo and personal details.</p>
                    </div>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5 max-w-2xl">
                <Input
                    label="Display Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-slate-950 border-slate-800 focus:border-blue-500"
                    placeholder="Your full name"
                />

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all min-h-[120px] resize-none"
                        placeholder="Tell us a little about yourself..."
                    />
                    <p className="text-xs text-slate-500 text-right">{bio.length}/160 characters</p>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end border-t border-slate-800 pt-6">
                <Button
                    disabled={loading || !changeDetected}
                    onClick={HandleSave}
                    className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
                >
                   {loading ? "Saving..." : <><Save size={18} className="mr-2" /> Save Changes</>}
                </Button>
            </div>
        </div>
    );
}

export default ProfileSection;