import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const register = async () => {
    try {
      const response = await axios.post('http://192.168.230.1:5000/auth/register', {
        email,
        password,
        name
      });
      navigation.navigate('Login');
    } catch (error) {
      setErrorMessage('Error during registration');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
      <Button title="Back to Spectacles" onPress={() => navigation.navigate('SpectaclesList')} />
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
      />
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
      <Button title="Register" onPress={register} />
    </View>
  );
};

export default RegisterScreen;
