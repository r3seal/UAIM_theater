import React, { useState, useEffect } from 'react';
import { View, Button, Text, FlatList } from 'react-native';
import axios from 'axios';

const SeatSelectionScreen = ({ route, navigation }: any) => {
  const { spectacleId } = route.params;
  const [seats, setSeats] = useState<any[]>([]);
  const [spectacleDetails, setSpectacleDetails] = useState<any>(null);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get(`http://192.168.230.1:5000/spectacles/${spectacleId}/seats`);
        setSeats(response.data.seats);
        setSpectacleDetails(response.data.spectacle);
      } catch (error) {
        console.error('Error fetching seats', error);
      }
    };
    fetchSeats();
  }, [spectacleId]);

  return (
    <View style={{ padding: 20 }}>
      {spectacleDetails && (
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            {spectacleDetails.title}
          </Text>
          <Text>{spectacleDetails.description}</Text>
          <Text>{`Date: ${new Date(spectacleDetails.date).toLocaleString()}`}</Text>
          <Text>{`Duration: ${spectacleDetails.duration} minutes`}</Text>
        </View>
      )}

      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Available Seats:</Text>

      <FlatList
        data={seats}
        keyExtractor={(item) => item.seat_id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>{`Row ${item.row}, Seat ${item.seat_number} ${item.available ? '(Available)' : '(Sold)'}`}</Text>
            {item.available && <Button title="Select" onPress={() => {}} />}
          </View>
        )}
      />
      <Button title="Back to Spectacles" onPress={() => navigation.navigate('SpectaclesList')} />
    </View>
  );
};

export default SeatSelectionScreen;
