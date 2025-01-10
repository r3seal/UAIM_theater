import axios from 'axios';
import urlAPI from "./urlAPI";

export const report = async (startDate: string, endDate: string, accessToken: string | null) => {
    try {
        const response = await axios.get(`${urlAPI}/admin/report`, {
            data: { start_date: startDate, end_date: endDate },
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log('Report:', response.data);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch report");
    }
};


export const addSpectacle = async (accessToken: string | null, spectacleData: any) => {
    try {
        const response = await axios.post(
            `${urlAPI}/admin/add_spectacle`,
            spectacleData, { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        console.log('Spectacle added successfully:', response.data);
        return response.data;
    } catch (error) {
        throw new Error("error");
    }
};
