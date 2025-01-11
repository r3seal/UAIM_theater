import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import urlAPI from './urlAPI';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${urlAPI}:5000/auth/login`, { email, password });
    if (response.status === 200) {
      await AsyncStorage.setItem('accessToken', response.data.access_token);
      await AsyncStorage.setItem('refreshToken', response.data.refresh_token);
      await AsyncStorage.setItem('permission', response.data.permission);
    }
    return response.status;
  } catch (error) {
    throw new Error('Login failed');
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(`${urlAPI}:5000/auth/logout`);
    if (response.status === 200) {
      await AsyncStorage.clear();
    }
    return response.status;
  } catch (error) {
    throw new Error('Logout failed');
  }
}

export const register = async (name: string, email: string, password: string, phone: string) => {
  try {
    const response = await axios.post(`${urlAPI}:5000/auth/register`, {
      name: name, email: email, password: password, phone: phone});
    return response.data;
  } catch (error) {
    throw new Error('Registration failed');
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
    try {
        const response = await axios.post(
            `${urlAPI}/auth/token/refresh`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            }
        );
        await AsyncStorage.setItem('accessToken', response.data.access_token);
    } catch (error) {
        throw new Error('Error refreshing token');
    }
};

export const refresh = async (apiFunc, ...args) => {
    try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
            await refreshAccessToken(refreshToken);
        }
        return await apiFunc(...args);
    } catch (error) {
        throw error;
    }
};


