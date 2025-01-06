import axios from 'axios';

export const buyTickets = async (token: string, seatIds: number[], spectacleId: number) => {
  try {
    const response = await axios.post(
      'http://192.168.230.1:5000/buy',
      { seat_ids: seatIds, spectacle_id: spectacleId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error('Ticket purchase failed');
  }
};
