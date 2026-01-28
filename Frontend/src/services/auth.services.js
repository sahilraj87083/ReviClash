import { api } from "./api.services";

export const loginService = (data) =>
    api.post("/users/login", data).then(res => res.data.data);


export const registerService = (data) =>
    api.post("/users/register", data).then(res => res.data.data);


export const refreshTokenService = () =>
    api.post("/users/refresh-token").then(res => res.data.data);


export const logoutService = () =>
    api.post("/users/logout");

export const getCurrUserService = () => 
    api.get('/users/current-user').then(res => res.data.data)

export const resetPasswordService = async ( {token , password}) => {
    const res = await api.post('/users/reset-password' , {token , password})
    return res.data.data
}

export const verifyEmailService = (token) => {
    api.get(`/users/verify-email?token=${token}`);
}

export const forgotPasswordService = (data) =>
    api.post("/users/forgot-password", data);

export const resendVerificationEmailService = async () => {
    const res = await api.post("/users/resend-verification");
    return res.data;
};

export const updateAccountDetailsService = (data) => {
    console.log(data)
}