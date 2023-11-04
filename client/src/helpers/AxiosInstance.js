import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        common: {
            "Content-Type": "application/json", // Set the defaut content type to JSON
        }
    }
});

export default axiosInstance;