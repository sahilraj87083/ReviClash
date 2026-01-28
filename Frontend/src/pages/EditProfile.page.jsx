import { useState } from "react";
import { updateAccountDetailsService } from "../services/auth.services";
// import { updateAvatarService, updateCoverService } from "../services/user.services";
import toast from "react-hot-toast";

function EditProfile() {
    const [fullName, setFullName] = useState("");
    const [bio, setBio] = useState("");

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            await updateAccountDetailsService({ fullName, bio });
            toast.success("Profile updated");
        } catch {
            toast.error("Failed to update profile");
        }
    };

    return (
        <div className="min-h-screen p-10 text-white max-w-3xl mx-auto">

            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

            <form onSubmit={handleUpdate} className="space-y-4">

                <input
                    placeholder="Full name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full p-2 bg-slate-800"
                />

                <textarea
                    placeholder="Bio"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="w-full p-2 bg-slate-800"
                />

                <button className="bg-red-600 px-6 py-2 rounded">
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default EditProfile;
