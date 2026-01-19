import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { getCurrUserService } from "../../services/auth.services.js";
import {useUserContext} from '../../contexts/UserContext.jsx'

const UserProtectedWrapper = ({children}) => {

    const {isAuthReady, setUser, authToken, setAuthToken} = useUserContext()
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthReady) return;

        if (!authToken) {
            navigate("/user/login");
            return;
        }

        (async () => {
            try {
                const user = await getCurrUserService();
                setUser(user)
            } catch (error) {
                setAuthToken(null);
                navigate("/user/login");
            } finally {
                setIsLoading(false);
            }
        })()
    }, [authToken, isAuthReady])


    if (!isAuthReady) {
        return <div>Loading...</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {children}
        </>
    )

}

export default UserProtectedWrapper;