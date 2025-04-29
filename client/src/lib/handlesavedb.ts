import axios from 'axios';
import { Logger } from './utils';

export const saveDB = async (id: number | null, updatedRow: any, httpVerb: string | undefined) => {
    const accessToken = sessionStorage.getItem("access");
    try {
        if (httpVerb === 'post') {
            const response = await axios.post(`http://127.0.0.1:8000/customers/`, updatedRow, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            Logger.info('Customer created successfully:', response.data);
            return response.data;
        }

        if (httpVerb == 'patch') {
            const response = await axios.patch(`http://127.0.0.1:8000/customers/${id}/`,
                updatedRow, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
            );
            Logger.info('Customer(s) updated successfully:', response.data);
            return response.data;
        }

        if (httpVerb == 'delete') {
            const response = await axios.delete(`http://127.0.0.1:8000/customers/${id}/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
            );
            Logger.info('Customer(s) updated successfully:', response.data);
            return response.data;
        }

    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            Logger.error('Axios error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
        } else {
            Logger.error('Error:', error);
        }
        throw new Error('Failed to save customer');
    }
};