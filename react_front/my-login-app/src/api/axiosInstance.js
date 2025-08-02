import axios from "axios";
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('accessToken');
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;
        // 토큰 만료 -> 새로운 토큰 요청
        if(err.response?.state == 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res = await axios.post("http://localhost:8080/api/auth/refresh", {}, {withCredentials: true});
                const newAccessToken = res.data.accessToken;
                Cookies.set("accessToken", newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch(err) {
                console.log("refresh fail : " + err);
                window.location.href = "/login";
            }
        }
        
        return Promise.reject(err);
    }
)

export default axiosInstance;
