import { Route } from "react-router-dom";
import {
    Register,
    Home,
    Login,
    Explore
}
from '../../pages'
import GuestOnlyWrapper from "./GuestOnlyWrapper";

export const PublicRoutes = (
    <>
        <Route index element = {<Home/>} />
        <Route path="/explore" element = { <Explore/> }/>

        <Route path="/user/register" element = { 
            <GuestOnlyWrapper>
                <Register/> 
            </GuestOnlyWrapper>
        }/>
        <Route path="/user/login" element = { 
            <GuestOnlyWrapper>
                <Login/>
            </GuestOnlyWrapper>
         }/>
    </>
)