import axios from 'axios';
import urlAPI from "./urlAPI";

// Report request with Bearer authorization
export const report = async (startDate: string, endDate: string, accessToken: string | null) => {
    try {
        const response = await axios.post(
        `${urlAPI}:5000/admin/report`,
        { start_date: startDate, end_date: endDate },
        { headers: { Authorization: `Bearer ${accessToken}`}}
    );
        return response;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch report");
    }
};


export const addSpectacle = async (
    accessToken: string | null,
    title: string,
    description: string,
    date: string,
    duration: number,
    ticketPrice1To5: number,
    ticketPriceAbove5: number,
    hallName: string
) => {
    try {
        const response = await axios.post(
            `${urlAPI}:5000/admin/add_spectacle`,
                {
                    title: title,
                    description: description,
                    date: date,
                    duration: duration,
                    ticket_price_1_to_5: ticketPrice1To5,
                    ticket_price_above_5: ticketPriceAbove5,
                    hall_name: hallName
                },
            { headers: { Authorization: `Bearer ${accessToken}`}}
        );
        return response.status;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to add spectacle");
    }
};

