import { resendVerificationEmailService } from "../../services/auth.services";
import { useUserContext } from "../../contexts/UserContext";
import toast from "react-hot-toast";
import { useState } from "react";
import { Mail, CheckCircle, AlertTriangle } from "lucide-react";

function EmailSection() {
    const { user } = useUserContext();
    const [loading, setLoading] = useState(false);

    const resend = async () => {
        if (loading || user.emailVerified) return;

        try {
            setLoading(true);
            await resendVerificationEmailService();
            toast.success("Verification email sent");
        } catch (error) {
            toast.error(error?.message || "Failed to resend verification email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-4">Email Preferences</h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                        <Mail size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Primary Email</p>
                        <p className="text-lg font-semibold text-white">{user.email}</p>
                    </div>
                </div>

                <div className="w-full md:w-auto">
                    {user.emailVerified ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-sm font-medium justify-center">
                            <CheckCircle size={16} /> Verified
                        </div>
                    ) : (
                        <div className="flex flex-col items-end gap-2 w-full">
                            <div className="flex items-center gap-2 text-orange-400 text-sm font-medium w-full md:w-auto justify-center md:justify-end">
                                <AlertTriangle size={16} /> Verification Pending
                            </div>
                            <button
                                onClick={resend}
                                disabled={loading}
                                className="text-sm underline text-slate-400 hover:text-white transition w-full md:w-auto text-center md:text-right"
                            >
                                {loading ? "Sending..." : "Resend Verification Email"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EmailSection;