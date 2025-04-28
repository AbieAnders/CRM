import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios-instance';
import { setAccessToken } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { Logger } from '../lib/utils';

const useBootstrapToken = (retryOnFailure: boolean = false) => {
    const dispatch = useDispatch();
    const [bootstrapped, setBootstrapped] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAccessToken = async () => {
        try {
            const res = await axiosInstance.post('/auth/refresh-token-cookie/', {}, { withCredentials: true });
            const newToken = res.data['access-token'];
            if (newToken) {
                dispatch(setAccessToken(newToken));
                Logger.info("Token successfully fetched during bootstrap.");
                setBootstrapped(true);
            } else {
                setError('No access token received');
                Logger.error("Failed to receive a valid access token.");
                setBootstrapped(false);
            }
        } catch (error) {
            setError('Token bootstrap failed');
            Logger.error("Token bootstrap failed.", error);
            setBootstrapped(false);
        }
    }

    useEffect(() => {
        fetchAccessToken();
    }, []);

    return { bootstrapped, error };
};

export default useBootstrapToken;