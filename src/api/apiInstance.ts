import axios from "axios";
import { envVars } from "../constants/config/envVars";

const getBaseURL = () => envVars.api;

export const apiInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// You can optionally handle 401s if needed, but no token setup
// If you want to catch errors globally, you can add a response interceptor here
// apiInstance.interceptors.response.use(
//   response => response,
//   error => Promise.reject(error)
// );