import React, { useEffect, useState } from 'react';
import {ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Hall from '../components/Hall';
import axios from "axios";
import { buyTickets } from "../ticketApi.ts";
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
        console.log(accessToken);
        if (accessToken) {
            buyTickets(accessToken, selectedSeats, spectacleId);
        }
        navigation.replace('SpectaclesList');
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size={'large'} color="#FF4136" />
            </View>
        );
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
            <ScrollView style={styles.reservationContainer}>
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
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001F3F',
        maxHeight: '100vh',
        overflow: Platform.select({
            web: 'scroll',
            default: 'hidden'
        }),
    },
    reservationContainer: {
        padding: 20,
        backgroundColor: '#001F3F', // Ciemnoniebieskie tło
        flex: 1,
        width: Platform.select({
            web: '50%',
            default: '100%'
        }),
        margin: 'auto',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    details: {
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 5,
    },
    bookButton: {
        backgroundColor: '#800000',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#800000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
        marginBottom: 50
    },
    bookButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    selectedSeatsContainer: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginBottom: 20,
        borderRadius: 30,
        borderColor: 'rgb(150, 150, 150)',
        borderWidth: 1,
        backgroundColor: '#002D62', // Ciemnoniebieskie tło dla wybranych miejsc
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default SeatSelectionScreen;
