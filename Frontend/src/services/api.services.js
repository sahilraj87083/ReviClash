import axios from "axios";
// 1. Determine the URL based on the environment
const baseURL = import.meta.env.PROD 
  ? import.meta.env.VITE_PROD_API  // Uses Render link when deployed
  : import.meta.env.VITE_LOCAL_API; // Uses Localhost when running locally

export const api = axios.create({
  baseURL: `${baseURL}/api/v1`, 
  withCredentials: true,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
