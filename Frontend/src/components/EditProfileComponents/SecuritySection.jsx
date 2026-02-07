import toast from "react-hot-toast";
import { useState } from "react";
import { Input, Button} from '../';
import { Lock, KeyRound } from "lucide-react";

function SecuritySection({ updatePassword }) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword , setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const changePasswordHandler = async () => {
        if (loading) return;

        if(newPassword !== confirmPassword){
            toast.error("Password mismatch");
            return;
        }
        if(oldPassword === newPassword){
            toast.error('New password cannot be the same as old');
            return;
        }
        const data = {
            oldPassword : oldPassword,
            newPassword : newPassword,
            confirmPassword : confirmPassword
        }
        setLoading(true);
        await updatePassword(data);
        toast.success("Password changed successfully");
        setLoading(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-4">Security</h2>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                
                {/* Visual / Info */}
                <div className="w-full md:w-1/3 bg-blue-500/5 border border-blue-500/10 rounded-xl p-6 text-blue-200 text-sm space-y-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 mb-2">
                        <Lock size={20} />
                    </div>
                    <h3 className="font-semibold text-white">Password Requirements</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 marker:text-blue-500">
                        <li>Minimum 8 characters long</li>
                        <li>At least one special character</li>
                        <li>Not the same as previous password</li>
                    </ul>
                </div>

                {/* Form */}
                <div className="flex-1 space-y-5 w-full">
                    <Input
                        label="Current Password"
                        value={oldPassword}
                        placeholder="••••••••"
                        type="password"
                        onChange={e => setOldPassword(e.target.value)}
                        className="bg-slate-950 border-slate-800"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                            label="New Password"
                            placeholder="••••••••"
                            value={newPassword}
                            type="password"
                            onChange={e => setNewPassword(e.target.value)}
                            className="bg-slate-950 border-slate-800"
                        />

                        <Input
                            label="Confirm New Password"
                            placeholder="••••••••"
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="bg-slate-950 border-slate-800"
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            disabled={loading || !oldPassword || !newPassword}
                            onClick={changePasswordHandler}
                            className="bg-blue-600 hover:bg-blue-500 w-full md:w-auto"
                        >
                            {loading ? "Updating..." : "Change Password"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SecuritySection;