import { createContext, useContext, useState, useEffect } from "react";
import { api, setAuthToken } from "../services/api.services";
import { refreshTokenService } from "../services/auth.services";
import { useNavigate } from 'react-router-dom'

const UserContext = createContext(null);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within UserProvider");
    }
    return context;
};

export const UserContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [authToken, setAuthTokenState] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    const isAuthenticated = !!authToken;

    // const navigate = useNavigate()

    useEffect(() => {

        // bootstrap auth on refresh
        const bootstrapAuth = async () => {
            try {
                const res = await refreshTokenService();
                setAuth(res.accessToken,  res.user);
            } catch (err) {
                // silent fail (not logged in user)
                // console.log(err)
            } finally {
                setIsAuthReady(true);
            }
        };

        bootstrapAuth();

    }, []);

    const setAuth = (token, user) => {
        setAuthTokenState(token);
        setAuthToken(token);
        setUser(user);
    };

    const logout = () => {
        setAuthTokenState(null);
        setAuthToken(null);
        setUser(null);
    };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        authToken,
        setAuth,
        logout,
        isAuthReady,
        setIsAuthReady,
        isAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

