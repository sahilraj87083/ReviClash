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
