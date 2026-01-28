import { useState } from "react";
import toast from "react-hot-toast";
import { forgotPasswordService } from "../services/auth.services";

function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await forgotPasswordService({ email });
            toast.success("If email exists, reset link sent");
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded">
                <h1 className="text-xl mb-4 text-white">Forgot Password</h1>

                <input
                    className="p-2 w-full mb-3"
                    placeholder="Enter email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <button className="bg-red-600 px-4 py-2 text-white">
                    Send Reset Link
                </button>
            </form>
        </div>
    );
}

export default ForgotPassword;
