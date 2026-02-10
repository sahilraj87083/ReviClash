import { data } from "react-router-dom";
import { api } from "./api.services";

export const loginService = (data) =>
    api.post("/users/login", data).then(res => res.data.data);


export const registerService = (data) =>
    api.post("/users/register", data).then(res => res.data);


// export const refreshTokenService = () =>
//     api.post("/users/refresh-token").then(res => res.data.data);
export const refreshTokenService = async () => {
    // Get the backup token from LocalStorage
    const fallbackToken = localStorage.getItem("refreshToken");

    // Send it in the body. If cookies work, backend uses cookies. 
    // If cookies fail (Mobile), backend uses this body token.
    return api.post("/users/refresh-token", { 
        refreshToken: fallbackToken 
    }).then(res => res.data.data);
};


export const logoutService = async () =>
    await api.post("/users/logout");

export const getCurrUserService = () => 
    api.get('/users/current-user').then(res => res.data.data)


export const searchUsersService = async (query) => {
    try {
        const response = await api.get(`/users/search?query=${query}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserNameService = async ( data ) => {
    const res = await api.patch('/users/update-username', data)
    return res.data.data
}

export const checkUsernameService = async (username) => {
    try {
        const response = await api.get(`/users/check-username/${username}`);
        return response.data.data; // Returns { isAvailable: true/false }
    } catch (error) {
        throw error;
    }
};

export const changeCurrentPasswordService = async (data) => {
    await api.post('/users/change-password', data)
}

export const sendOTPService = async (email) => {
    const res = await api.post(`/otp/send`, {email});
    return res.data
}

export const sendForgotPasswordOtpService = async (email) => {
    const res = await api.post("/users/forgot-password/send", { email });
    return res.data
}

export const verifyForgotPasswordOtpService = async (data) => {
    const res = await api.post("/users/forgot-password/verify", data);
    return res.data
}

export const resetPasswordService = async (data) => {
    const res = await api.post("/users/forgot-password/reset", data);
    return res.data
}

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
