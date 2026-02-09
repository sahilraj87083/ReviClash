import { data } from "react-router-dom";
import { api } from "./api.services";

export const loginService = (data) =>
    api.post("/users/login", data).then(res => res.data.data);


export const registerService = (data) =>
    api.post("/users/register", data).then(res => res.data);


export const refreshTokenService = () =>
    api.post("/users/refresh-token").then(res => res.data.data);


export const logoutService = async () =>
    await api.post("/users/logout");

export const getCurrUserService = () => 
    api.get('/users/current-user').then(res => res.data.data)

export const updateUserNameService = async ( data ) => {
    const res = await api.patch('/users/update-username', data)
    return res.data.data
}

export const changeCurrentPasswordService = async (data) => {
    await api.post('/users/change-password', data)
}

export const resetPasswordService = async ( {token , password}) => {
    const res = await api.post('/users/reset-password' , {token , password})
    return res.data.data
}

export const sendOTPService = async (email) => {
    const res = await api.post(`/otp/send`, {email});
    return res.data
}

export const forgotPasswordService = (data) =>
    api.post("/users/forgot-password", data);

export const resendVerificationEmailService = async () => {
    const res = await api.post("/users/resend-verification");
    return res.data;
};

export const updateAccountDetailsService = async (data) => {
    const res = await api.patch('/users/update-account', data);
    return res.data.data
}

export const updateAvatarService = async (formData) => {
    const res = await api.patch("/users/update-avatar", formData);
    return res.data.data;
};

export const updateCoverService = async (formData) => {
    const res = await api.patch("/users/update-coverImage", formData);
    return res.data.data;
};
