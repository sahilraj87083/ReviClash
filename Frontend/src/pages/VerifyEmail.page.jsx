import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
// import { verifyEmailService } from "../services/auth.services";
import { useUserContext } from "../contexts/UserContext";

function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    // already verified
    if (user?.emailVerified) {
      navigate("/user/dashboard");
      return;
    }

    if (!token) {
      toast.error("Invalid verification link");
      return;
    }

    (async () => {
      try {
        // await verifyEmailService(token);
        toast.success("Email verified successfully");
        navigate("/user/login");
      } catch (err) {
        toast.error("Verification link expired or invalid");
      }
    })();
  }, [token, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Verifying your email...
    </div>
  );
}

export default VerifyEmail;
