import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Seat from './Seat';

const Hall = ({ hallName, seats, selectedSeats, setSelectedSeats }) => {
    const toggleSeat = (seat_id) => {
        if (selectedSeats.includes(seat_id)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seat_id));
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
        </View>
    );
};


const styles = StyleSheet.create({
    hallContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        padding: 20,
        borderRadius: 30,
        borderColor: 'rgb(150, 150, 150)',
        borderWidth: 1,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    selectedText: {
        fontSize: 16,
        marginBottom: 20,
    },
    grid: {
        width: '90%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 2,
    },
});

export default Hall;
