import axios from 'axios';

export const saveDB = async (id: number, updatedRow: any, httpVerb: string | undefined) => {
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ1MzkyNTI5LCJpYXQiOjE3NDUzOTA3MjksImp0aSI6IjE4Njk5NTY1MDc3ZDQ3YzU5MzJjN2ZiNTA1MjM1MzVhIiwidXNlcl9pZCI6M30.nSwWnIcC4doFi6fQDpXfbCX9BX-na6tVehdykLvjeU0";
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