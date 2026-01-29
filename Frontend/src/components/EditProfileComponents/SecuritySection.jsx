
import toast from "react-hot-toast";
import { useState } from "react";
import { Input, Button} from '../'

function SecuritySection({ updatePassword }) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword , setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false);

    const changePasswordHandler = async () => {
        if (loading) return;

        if(newPassword !== confirmPassword){
            toast.error("Password mismatch")
            return
        }
        if(oldPassword === newPassword){
            toast.error('You can not keep the old password ')
            return
        }
        const data = {
            oldPassword : oldPassword,
            newPassword : newPassword,
            confirmPassword : confirmPassword
        }
        setLoading(true);
        await updatePassword(data)
        toast.success("Password changed");
        setLoading(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    return (
        <div className="flex justify-center mt-12">
            <div className="w-full max-w-md bg-slate-900/60 border border-slate-700/50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6 text-center">
                    Change Password
                </h2>

                <div className="space-y-4">
                    <Input
                        value = {oldPassword}
                        placeholder="Old password"
                        type="password"
                        onChange={e => setOldPassword(e.target.value)}
                    />

                    <Input
                        placeholder="New password"
                        value = {newPassword}
                        type="password"
                        onChange={e => setNewPassword(e.target.value)}
                    />

                    <Input
                        placeholder="Confirm new password"
                        type="password"
                        value = {confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />

                    <Button
                        disabled={loading}
                        onClick={changePasswordHandler}
                        className="w-full bg-red-600 hover:bg-red-500 transition rounded-lg py-2 mt-4"
                    >
                        Update Password
                    </Button>
                </div>
            </div>
            </div>

    );
}

export default SecuritySection;
