import axios from "axios"
import { KEY_ACCESS_TOKEN, getItem, removeItem, setItem } from "./localStroageManager"

import store from '../redux/store.js'
import { TOAST_FAILURE } from "../App";
import { setLoading, showToast } from "../redux/slices/appConfigSlice";

const baseURL = import.meta.env.MODE === 'development'
  ? 'http://localhost:3000' 
  : import.meta.env.VITE_SERVER_BASE_URL; 

export const axiosClient = axios.create({
    baseURL,
    withCredentials: true
})

axiosClient.interceptors.request.use((request) => { 
    const accessToken = getItem(KEY_ACCESS_TOKEN);
    request.headers['Authorization'] = `Bearer ${accessToken}`
    store.dispatch(setLoading(true));
    return request;
});

axiosClient.interceptors.response.use(async (response) => {
    store.dispatch(setLoading(false));
    const data = response.data;
    if (data.status === "ok") {
        return data
    }

    const originalRequest = response.config;
    const statusCode = data.statusCode;
    const message = data.message

    if(message !== "invalid access key"){
        store.dispatch(showToast({
            type: TOAST_FAILURE,
            message
        }));
    }
    

    if (statusCode === 401 && originalRequest.url === "/auth/refresh") {
        removeItem(KEY_ACCESS_TOKEN);
        window.location.replace('/login/', '_self');
        return Promise.reject(message);
        
    }
    if (statusCode === 401) { 
        const data = await axiosClient.get('/auth/refresh');
        if (data.status === 'ok') {
            const accessToken = data.result.accessToken;
            setItem(KEY_ACCESS_TOKEN, accessToken);
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            originalRequest._retry = true;
            return axiosClient(originalRequest)
        }
    }
    return Promise.reject(message);
}, async (error) => {
    store.dispatch(setLoading(false));
    store.dispatch(showToast({
        type: TOAST_FAILURE,
        message: error.message
    }))
    return Promise.reject(error);
});