import { useState, useEffect } from 'react';
import { z } from 'zod';
import { customerSchema } from '../pages/_dashboard/DataTable';
import axiosInstance from '../api/axios-instance';
import { Logger } from '../lib/utils';
import axios from 'axios';
import { access } from 'fs';

const useFetchDB = (endpoint: unknown) => {
    const [data, setData] = useState<z.infer<typeof customerSchema>[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!endpoint) {
            Logger.error("Invalid endpoint provided");
            return;
        }
        //Logger.info(`Fetch data from endpoint: ${endpoint}`);
        const fetchData = async () => {
            const accessToken = sessionStorage.getItem("access");
            try {
                //const response = await axiosInstance.get(`/${endpoint}`);
                const response = await axios.get(`http://127.0.0.1:8000/${endpoint}`, {
                    headers: { 
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                //const json = await res.json();
                if (Array.isArray(response.data.results)) {
                    setData(response.data.results);
                    Logger.info(`Data fetched successfully from ${endpoint}`);
                } else {
                    setError("Invalid data format");
                    Logger.error(`Invalid data format received from endpoint: ${endpoint}`);
                }
            } catch (err) {
                setError("Failed to fetch data");
                Logger.error(`Failed to fetch data from ${endpoint}: ${err}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [endpoint]);

    return { data, loading, error };
};

export default useFetchDB;