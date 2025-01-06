import axios from 'axios';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post('http://192.168.230.1:5000/login', { email, password });
    return response.data.access_token;
  } catch (error) {
    throw new Error('Login failed');
  }
};
