import axios from 'axios';
import urlAPI from './urlAPI';

export const buyTickets = async (accessToken, seatIds, spectacleId) => {
  try {
    const response = await axios.post(
        `${urlAPI}:5000/spectacles/buy`,
        { seat_ids: seatIds, spectacle_id: spectacleId },
        { headers: { Authorization: `Bearer ${accessToken}`}}
    );
    return response.status;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.error || 'Ticket purchase failed');
    }
    console.error("Unexpected error:", error);
    throw new Error('Unexpected error occurred');
  }
};
