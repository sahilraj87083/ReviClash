import { createContext, useContext, useState, useEffect } from "react";
import { api, setAuthToken } from "../services/api.services";
import { refreshTokenService } from "../services/auth.services";

const UserContext = createContext(null);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUserContext must be used within UserProvider");
    return context;
};

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authToken, setAuthTokenState] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    const isAuthenticated = !!authToken;

    // Helper to set auth data in State + LocalStorage
    const setAuth = (token, user, refreshToken = null) => {
        setAuthTokenState(token);
        setAuthToken(token);
        setUser(user);
        
        // Save to LocalStorage (Mobile Backup)
        if (token) localStorage.setItem("accessToken", token);
        if (user) localStorage.setItem("user", JSON.stringify(user));
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    };

    const logout = () => {
        setAuthTokenState(null);
        setAuthToken(null);
        setUser(null);
        localStorage.clear(); // Clear local storage
    };

    useEffect(() => {
        const bootstrapAuth = async () => {
            try {
                // 1. Try to refresh using Cookies (Best Security)
                const res = await refreshTokenService();
                setAuth(res.accessToken, res.user, res.refreshToken);
            } catch (err) {
                // 2. FALLBACK: Check LocalStorage (For Mobile/Safari)
                const storedToken = localStorage.getItem("accessToken");
                const storedUser = localStorage.getItem("user");

                if (storedToken && storedUser) {
                    try {
                        setAuth(storedToken, JSON.parse(storedUser));
                    } catch (e) {
                        console.error("Failed to parse stored user", e);
                        logout();
                    }
                }
            } finally {
                setIsAuthReady(true);
            }
        };

        bootstrapAuth();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, authToken, setAuth, logout, isAuthReady, setIsAuthReady, isAuthenticated }}>
            {children}
        </UserContext.Provider>
    );
};