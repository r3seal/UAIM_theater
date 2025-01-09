import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import urlAPI from './urlAPI';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${urlAPI}:5000/login`, { email, password });
    await AsyncStorage.setItem('accessToken', response.data.access_token);
    await AsyncStorage.setItem('refreshToken', response.data.refresh_token);
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};
