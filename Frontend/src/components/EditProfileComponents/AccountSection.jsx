import { useState } from "react";
import { useUserContext } from "../../contexts/UserContext";
import toast from "react-hot-toast";
import { Button, Input } from '../';
import { Save } from "lucide-react";

function AccountSection({ updateUserName }) {
    const { user } = useUserContext();

    const [username, setUsername] = useState(user.username || "");
    const [loading, setLoading] = useState(false);
    const changesMade = user.username !== username;

    const handleUpdate = async () => {
        if (username.trim().length < 3) {
            toast.error("Username must be at least 3 characters");
            return;
        }

        if(username.trim().toLowerCase() === user.username){
            toast.error("Same as old username");
            return;
        }

        setLoading(true);
        await updateUserName({ newUsername : username });
        setLoading(false);
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-4">Account Settings</h2>

            <div className="space-y-6 max-w-xl">
                {/* Username */}
                <div>
                    <Input
                        label="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="bg-slate-950 border-slate-800"
                    />
                    <p className="text-xs text-slate-500 mt-2 pl-1">
                        Your profile URL: <span className="text-blue-400 font-mono">codewars.io/u/{username}</span>
                    </p>
                </div>

                {/* Email (Read Only) */}
                <div className="opacity-70">
                    <Input
                        label="Email Address"
                        value={user.email}
                        disabled
                        className="bg-slate-950 border-slate-800 cursor-not-allowed text-slate-400"
                    />
                    <p className="text-xs text-slate-500 mt-2 pl-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span> Contact support to change email.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-end border-t border-slate-800 pt-6">
                <Button
                    disabled={loading || !changesMade}
                    onClick={handleUpdate}
                    className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
                >
                    {loading ? "Updating..." : <><Save size={18} className="mr-2"/> Update Account</>}
                </Button>
            </div>
        </div>
    );
}

export default AccountSection;