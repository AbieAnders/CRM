import { useState, useEffect } from 'react';
import { z } from 'zod';
import { customerSchema } from '../pages/_dashboard/DataTable';
import axios from 'axios';

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
            const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ1MzI2NzgyLCJpYXQiOjE3NDUzMjQ5ODIsImp0aSI6IjY0NTYxZWZhZWM2MDRhM2JhNzA2OWU5ZGUwNjcwMjZiIiwidXNlcl9pZCI6M30.tZxKpabV33EjSJoqlKHj0b3KANwr0lySShYMQli7W34";
            try {
                const response = await axios.get(`http://127.0.0.1:8000/${endpoint}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
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