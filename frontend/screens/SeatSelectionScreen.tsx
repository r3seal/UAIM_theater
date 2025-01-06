import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Hall from '../components/Hall';
import axios from "axios";
import {buyTickets} from "../ticketApi.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import urlAPI from '../urlAPI';


const SeatSelectionScreen = ({ route, navigation }: any) => {
    const { spectacleId } = route.params;
    const [seats, setSeats] = useState<any[]>([]);
    const [spectacle, setSpectacle] = useState<any>(null);
    const [selectedSeats, setSelectedSeats] = useState<any>([]);
    const [hall, setHall] = useState<any>(null);
    const [loading, setLoading] = useState<any>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        axios.get(`${urlAPI}:5000/spectacles/${spectacleId}/seats`)
            .then((response: any) => {
                setSpectacle(response.data.spectacle);
                setHall(response.data.hall);
                setSeats(response.data.seats);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [spectacleId]);

    const book = async () => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (accessToken) {
            buyTickets(accessToken, selectedSeats, spectacleId);
        }
        navigation.replace('SpectaclesList');
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size={'large'} />
            </View>
        )
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{spectacle.title}</Text>
            <Text style={styles.details}>{'\u{1F551}'} {spectacle.duration} min</Text>
            <Text style={styles.details}>{'\u{1F4C5}'} {new Date(spectacle.date).toLocaleString()}</Text>
            <Text style={styles.details}>{spectacle.description}</Text>

            <Hall
                hallName={hall.name}
                seats={seats}
                selectedSeats={selectedSeats}
                setSelectedSeats={setSelectedSeats}
            />

            <View style={styles.selectedSeatsContainer}>
                <Text style={styles.details}>{'\u{1F464}'} x {selectedSeats.length}</Text>
                {selectedSeats.length > 0 && (
                    <Text style={styles.details}>
                        {selectedSeats.map((seatId: any) => {
                            const seat = seats.find(s => s.seat_id === seatId);
                            return seat ? `${seat.row}-${seat.seat_number}` : null;
                        }).filter(Boolean).join(', ')}
                    </Text>
                )}
            </View>

            <TouchableOpacity style={styles.bookButton} onPress={() => book()}>
                <Text style={styles.bookButtonText}>Book</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    details: {
        fontSize: 16,
    },
    bookButton: {
        backgroundColor: 'rgb(50, 50, 255)',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
    },
    bookButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    selectedSeatsContainer: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginBottom: 20,
        borderRadius: 30,
        borderColor: 'rgb(150, 150, 150)',
        borderWidth: 1,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
});

export default SeatSelectionScreen;
