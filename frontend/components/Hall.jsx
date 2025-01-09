import React from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import Seat from './Seat';

const Hall = ({ hallName, seats, selectedSeats, setSelectedSeats }) => {
    const toggleSeat = (seat_id) => {
        if (selectedSeats.includes(seat_id)) {
            setSelectedSeats(selectedSeats.filter((id) => id !== seat_id));
        } else {
            setSelectedSeats([...selectedSeats, seat_id]);
        }
    };

    const groupedSeats = seats.reduce((acc, seat) => {
        if (!acc[seat.row]) acc[seat.row] = [];
        acc[seat.row].push(seat);
        return acc;
    }, {});

    return (
        <View style={styles.hallContainer}>
            <Text style={styles.title}>{hallName}</Text>
            <ScrollView horizontal>
                <View style={styles.grid}>
                    {Object.keys(groupedSeats).map((row) => (
                        <View key={row} style={styles.row}>
                            {groupedSeats[row].map((seat) => (
                                <Seat
                                    key={seat.seat_id}
                                    seat_id={seat.seat_id}
                                    row={seat.row}
                                    seat_number={seat.seat_number}
                                    isAvailable={seat.available}
                                    isSelected={selectedSeats.includes(seat.seat_id)}
                                    onPress={toggleSeat}
                                />
                            ))}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    hallContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        padding: 20,
        borderRadius: 16,
        backgroundColor: '#292929',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF', // Czerwony jako akcent
        marginBottom: 20,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    grid: {
        width: '90%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Przezroczystość białego
        paddingVertical: 12,
        paddingHorizontal: 40,
        margin: "auto",
        borderRadius: 20,
        borderColor: 'rgba(255, 255, 255, 0.2)', // Subtelne obramowanie
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 6,
    },
});

export default Hall;
