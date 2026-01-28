import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { resetPasswordService } from "../services/auth.services";

function ResetPassword() {
    const [params] = useSearchParams();
    const token = params.get("token");
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirm) {
            toast.error("Passwords do not match");
            return;
        }

        await resetPasswordService({ token, password });

        toast.success("Password reset successful");
        navigate("/login");
    };

    if (!token) {
        return <p>Invalid reset link</p>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Reset Password</h1>
            <input type="password" placeholder="New password" onChange={e => setPassword(e.target.value)} />
            <input type="password" placeholder="Confirm password" onChange={e => setConfirm(e.target.value)} />
            <button type="submit">Reset</button>
        </form>
    );
}

export default ResetPassword;
