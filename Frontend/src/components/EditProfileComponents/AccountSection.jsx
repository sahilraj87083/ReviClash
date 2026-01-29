import { useState } from "react";
import { useUserContext } from "../../contexts/UserContext";
import toast from "react-hot-toast";
import { Button, Input } from '../'

function AccountSection({ updateUserName }) {
    const { user } = useUserContext();

    const [username, setUsername] = useState(user.username || "");
    const [loading, setLoading] = useState(false);
    const changesMade = user.username !== username

    const handleUpdate = async () => {
        if (username.trim().length < 3) {
            toast.error("Username must be at least 3 characters");
            return;
        }

        if(username.trim().toLowerCase() === user.username){
            toast.error("Same as old username")
            return;
        }

        setLoading(true);
        await updateUserName({ newUsername : username });
        setLoading(false);
    };

    return (
        <div className="space-y-6">

            <h2 className="text-xl font-bold">Account</h2>

            {/* Username */}
            <div>
                <Input
                label = {"Username"}
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-800 p-3 rounded mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">
                Changing username will change your profile URL.
                </p>
            </div>

            {/* Email (read-only) */}
            <div>
                <Input
                label = {"Email"}
                value={user.email}
                disabled
                className="w-full bg-slate-800 p-3 rounded mt-1 opacity-70 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">
                Email cannot be changed. Contact support if needed.
                </p>
            </div>

            {/* Save */}
            <button
                disabled={loading || !changesMade}
                hidden = {!changesMade}
                onClick={handleUpdate}
                className="bg-red-600 px-6 py-2 rounded disabled:opacity-50"
            >
                {loading ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
}

export default AccountSection;
