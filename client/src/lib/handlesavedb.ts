import axios from 'axios';

export const saveDB = async (id: number, updatedRow: any, httpVerb: string | undefined) => {
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ1MzI2NzgyLCJpYXQiOjE3NDUzMjQ5ODIsImp0aSI6IjY0NTYxZWZhZWM2MDRhM2JhNzA2OWU5ZGUwNjcwMjZiIiwidXNlcl9pZCI6M30.tZxKpabV33EjSJoqlKHj0b3KANwr0lySShYMQli7W34";
    try {
        if (httpVerb == 'patch') {
            const response = await axios.patch(`http://127.0.0.1:8000/customers/${id}/`,
                updatedRow, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
            );
            console.log('Customer(s) updated successfully:', response.data);
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
            console.log('Customer(s) updated successfully:', response.data);
            return response.data;
        }

    } catch (error) {
        console.error('Failed to save customer:', error);
        throw new Error('Failed to save customer');
    }
};