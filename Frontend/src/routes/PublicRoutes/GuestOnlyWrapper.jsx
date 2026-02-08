import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import { LoadingState } from "../../components";


const GuestOnlyWrapper = ({ children }) => {
  const { authToken, isAuthReady } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthReady) return;

    if (authToken) {
      navigate("/user/dashboard");
    }
  }, [authToken, isAuthReady]);

  if (!isAuthReady || authToken) {
      return <LoadingState message="Redirecting..." />;
  }

  return <>{children}</>;
};

export default GuestOnlyWrapper;
