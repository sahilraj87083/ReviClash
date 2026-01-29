import { resendVerificationEmailService } from "../../services/auth.services";
import { useUserContext } from "../../contexts/UserContext";
import toast from "react-hot-toast";
import { useState } from "react";

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
        <div className="space-y-3">
            <p className="font-semibold">Email: {user.email}</p>

            {!user.emailVerified ? (
                <div className="bg-yellow-500/10 p-4 rounded flex justify-between items-center">
                    <p className="font-semibold text-orange-300 underline">
                        Email not verified
                    </p>
                    <button
                        onClick={resend}
                        disabled={loading}
                        className="underline text-red-400 disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Resend verification"}
                    </button>
                </div>
            ) : (
                <p className="text-green-400 flex items-center gap-1">
                    Email already verified <i className="ri-check-line"></i>
                </p>
            )}
        </div>
    );
}

export default EmailSection;
