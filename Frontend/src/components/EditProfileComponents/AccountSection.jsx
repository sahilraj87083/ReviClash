import { useState, useEffect } from "react";
import { useUserContext } from "../../contexts/UserContext";
import toast from "react-hot-toast";
import { Button, Input } from '../'; 
import { checkUsernameService } from "../../services/auth.services"; 
import { 
    Save, 
    AlertCircle, 
    Loader2, 
    CheckCircle2, 
    XCircle 
} from "lucide-react";

function AccountSection({ updateUserName }) {
    const { user } = useUserContext();

    const [username, setUsername] = useState(user.username || "");
    const [loading, setLoading] = useState(false);
    
    // Username Check States
    const [usernameAvailable, setUsernameAvailable] = useState(null); 
    const [checkingUsername, setCheckingUsername] = useState(false);

    // Derived state
    const changesMade = username.trim().toLowerCase() !== user.username;

    // --- USERNAME CHECK LOGIC ---
    useEffect(() => {
        const checkUsername = async () => {
            const currentInput = username.trim().toLowerCase();

            // 1. If username matches current user, stop checking and reset status
            if (currentInput === user.username) {
                setUsernameAvailable(null);
                return;
            }

            // 2. Validate Format (Regex: alphanumeric, underscore, dot, 3-20 chars)
            const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;
            if (!usernameRegex.test(currentInput)) {
                setUsernameAvailable(false); 
                return;
            }

            setCheckingUsername(true);
            try {
                // 3. Admin check simulation (optional, based on your previous code)
                if(currentInput === 'admin') throw new Error("Taken");

                // 4. API Call
                const data = await checkUsernameService(currentInput);
                setUsernameAvailable(data.isAvailable);
            } catch (error) {
                console.error("Username check failed", error);
                setUsernameAvailable(false);
            } finally {
                setCheckingUsername(false);
            }
        };

        // Debounce
        const timeoutId = setTimeout(() => {
            if (username) checkUsername();
            else setUsernameAvailable(null);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [username, user.username]);

    const handleUpdate = async () => {
        if (username.trim().length < 3) {
            toast.error("Username must be at least 3 characters");
            return;
        }

        if(!changesMade){
            return;
        }

        // Prevent update if marked as unavailable
        if (usernameAvailable === false) {
            toast.error("Username is already taken");
            return;
        }

        setLoading(true);
        try {
            await updateUserName({ newUsername : username });
            // On success, reset availability state since it's now the user's current name
            setUsernameAvailable(null);
        } catch (error) {
            // Error handled in parent
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-4">Account Settings</h2>

            <div className="space-y-6 max-w-xl">
                {/* Username Input */}
                <div>
                    <div className="relative">
                        <Input
                            label="Username"
                            value={username}
                            onChange={e => {
                                setUsername(e.target.value);
                                // Reset availability immediately on typing to remove old status icons
                                if (e.target.value !== username) setUsernameAvailable(null);
                            }}
                            // Dynamic Border Colors
                            className={`
                                bg-slate-950 
                                ${usernameAvailable === true ? "border-green-500/50 focus:border-green-500" : 
                                  usernameAvailable === false ? "border-red-500/50 focus:border-red-500" : 
                                  "border-slate-800 focus:border-blue-500"}
                            `}
                            placeholder="Enter new username"
                        />

                        {/* Status Icons (Absolute Positioned) */}
                        <div className="absolute right-3 top-[2.3rem] pointer-events-none">
                            {checkingUsername && (
                                <Loader2 size={16} className="text-slate-500 animate-spin" />
                            )}
                            
                            {!checkingUsername && changesMade && usernameAvailable === true && (
                                <CheckCircle2 size={16} className="text-green-500 animate-in zoom-in" />
                            )}
                            
                            {!checkingUsername && changesMade && usernameAvailable === false && (
                                <XCircle size={16} className="text-red-500 animate-in zoom-in" />
                            )}
                        </div>
                    </div>
                    
                    {/* Helper Text / Validation Errors */}
                    <div className="flex justify-between items-start mt-2 px-1">
                        <p className="text-xs text-slate-500">
                            Profile URL: <span className="text-blue-400 font-mono">reviclash.com/u/{username}</span>
                        </p>
                        
                        {/* Validation Hint: Too Short */}
                        {username.length > 0 && username.length < 3 && (
                            <span className="text-xs text-red-400 flex items-center gap-1">
                                <AlertCircle size={12}/> Too short
                            </span>
                        )}

                        {/* Validation Hint: Taken */}
                        {!checkingUsername && usernameAvailable === false && (
                            <span className="text-xs text-red-400 flex items-center gap-1">
                                Username taken
                            </span>
                        )}
                    </div>
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
                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span> 
                        Email cannot be changed securely at this moment.
                    </p>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end border-t border-slate-800 pt-6">
                {changesMade && (
                    <span className="text-xs text-slate-400 mr-4 animate-pulse hidden md:block">
                        Unsaved changes
                    </span>
                )}
                
                <Button
                    // Disable if: Loading OR No Changes OR Username is Taken OR Currently Checking
                    disabled={loading || !changesMade || usernameAvailable === false || checkingUsername || username.length < 3}
                    onClick={handleUpdate}
                    className={`
                        shadow-lg transition-all duration-300
                        ${changesMade 
                            ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20" 
                            : "bg-slate-800 text-slate-500 cursor-not-allowed"
                        }
                    `}
                >
                    {loading ? (
                        "Updating..." 
                    ) : (
                        <><Save size={18} className="mr-2"/> Update Account</>
                    )}
                </Button>
            </div>
        </div>
    );
}

export default AccountSection;