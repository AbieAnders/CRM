import axios from 'axios';
import { store } from '../store/store';
import { setAccessToken } from '../store/authSlice';
import { Logger } from '../lib/utils';

const BACKEND_URL = 'http://127.0.0.1:8000'

/*let accessToken = '';
export const setAccessToken = (token: string) => {
    accessToken = token;
};*/

const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const accessToken = state.auth.accessToken;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            const res = await axios.post(`${BACKEND_URL}/auth/refresh-token-cookie/`, {}, { withCredentials: true });
            const newToken = res.data['access-token'];
            if (newToken) {
                store.dispatch(setAccessToken(newToken));
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                Logger.info("Successfully refreshed access token");
                return axiosInstance(originalRequest);
            }
            else {
                Logger.warn('Failed to generate or retrieve new access token', '');
                return Promise.reject('Failed to refresh access token');
            }

        } catch (refreshError) {
            Logger.warn('Failed access token refresh process on page load:', error);
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
}
);

export default axiosInstance;