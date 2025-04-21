import axios from 'axios';

export const saveDB = async (id: number, updatedRow: any, httpVerb: string | undefined) => {
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ1MjU2MDI1LCJpYXQiOjE3NDUyNTQyMjUsImp0aSI6IjcxMjFkMDk5YjliMTRhM2JiNzRjZGMwYmFlNDdkNTNhIiwidXNlcl9pZCI6MX0.r1AFDVyQzZn_7CEkboC0P30SFKuLzoIjLehW82U4IRE";
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