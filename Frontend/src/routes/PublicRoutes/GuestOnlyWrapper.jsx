import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";


const GuestOnlyWrapper = ({ children }) => {
  const { authToken, isAuthReady } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthReady) return;

    if (authToken) {
      navigate("/user/dashboard");
    }
  }, [authToken, isAuthReady]);

  if (!isAuthReady) return <div>Loading...</div>;

  return <>{children}</>;
};

export default GuestOnlyWrapper;
