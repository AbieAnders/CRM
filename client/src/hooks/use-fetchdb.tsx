import { useState, useEffect } from 'react';
import { z } from 'zod';
import { customerSchema } from '../pages/_dashboard/DataTable';
import axiosInstance from '../api/axios-instance';

const useFetchDB = (endpoint: unknown) => {
    const [data, setData] = useState<z.infer<typeof customerSchema>[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!endpoint) {
            console.error("Invalid endpoint provided");
            return;
        }
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/${endpoint}`);
                //const json = await res.json();
                if (Array.isArray(response.data.results)) {
                    setData(response.data.results);
                } else {
                    setError("Invalid data format");
                }
            } catch (err) {
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        console.log("Endpoint fetched successfully", endpoint)
    }, [endpoint]);

    return { data, loading, error };
};

export default useFetchDB;