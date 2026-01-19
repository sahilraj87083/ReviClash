import { Outlet } from "react-router-dom";
import UserProtectedWrapper from "./UserProtectedWrapper";


const ProtectedLayout = () => {
    return (
        <UserProtectedWrapper>
            <Outlet/>
        </UserProtectedWrapper>
    )
}

export default ProtectedLayout