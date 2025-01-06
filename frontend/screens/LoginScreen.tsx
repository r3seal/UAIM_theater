import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import urlAPI from '../urlAPI';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const login = async () => {
    try {
      const response = await axios.post(`${urlAPI}:5000/auth/login`, {
        email,
        password
      });
      const { access_token } = response.data;
      await AsyncStorage.setItem('accessToken', access_token);
      console.log(access_token);
      navigation.replace('SpectaclesList');
    } catch (error) {
      setErrorMessage('Invalid credentials');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
      <Button title="Back to Spectacles" onPress={() => navigation.navigate('SpectaclesList')} />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
      />
      {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
      <Button title="Login" onPress={login} />
    </View>
  );
};

export default LoginScreen;
