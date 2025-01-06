import React, { useState, useEffect } from 'react';
import { View, Button, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const SpectaclesListScreen = ({ navigation }: any) => {
  const [spectacles, setSpectacles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpectacles = async () => {
      try {
        const response = await axios.get('http://192.168.230.1:5000/spectacles/');
        setSpectacles(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (axios.isAxiosError(error)) {
          setError(`Response error: ${error.response?.status} - ${error.response?.data}`);
        } else {
          setError('Unexpected error occurred');
        }
      }
    };
    fetchSpectacles();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading spectacles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
      <FlatList
        data={spectacles}
        keyExtractor={(item) => item.spectatle_id}
        renderItem={({ item }) => (
          <View style={styles.spectacleItem}>
            <Text style={styles.title}>{item.title ?? 'No Title'}</Text>
            <Text style={styles.description}>{item.description ?? 'No Description'}</Text>
            <Button
              title="Select Seats"
              onPress={() => navigation.navigate('SeatSelection', { spectacleId: item.spectatle_id })}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  spectacleItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 5,
    color: '#555',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default SpectaclesListScreen;
