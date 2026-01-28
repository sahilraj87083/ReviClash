import { Route } from "react-router-dom";
import {
    Register,
    Home,
    Login,
    Explore,
    ResetPassword,
    ForgotPassword,
    VerifyEmail
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

        <Route path="/forgot-password" element={
            <GuestOnlyWrapper>
                <ForgotPassword />
            </GuestOnlyWrapper>
        } />
        <Route path="/reset-password" element={ <ResetPassword /> } />

        <Route path="/verify-email" element={ <VerifyEmail /> } />

    </>
)