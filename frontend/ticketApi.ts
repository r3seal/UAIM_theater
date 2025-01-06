import axios from 'axios';
import urlAPI from './urlAPI';

export const buyTickets = async (token: string, seatIds: number[], spectacleId: number) => {
  try {
    const response = await axios.post(
      `${urlAPI}:5000/spectacles/buy`,
      { seat_ids: seatIds, spectacle_id: spectacleId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error('Ticket purchase failed');
  }
};
