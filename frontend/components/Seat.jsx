import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Seat = ({ seat_id, row, seat_number, isAvailable, isSelected, onPress }) => {
    return (
        <TouchableOpacity
            style={[
                styles.seat,
                {
                    backgroundColor: isSelected ? 'rgba(50, 200, 50, 0.5)'
                        : isAvailable ? 'rgba(220, 220, 220, 0.5)' : 'rgba(200, 50, 50, 0.5)',
                },
                {
                    borderColor: isSelected ? 'rgb(50, 200, 50)'
                        : isAvailable ? 'rgb(150, 150, 150)' : 'rgb(200, 50, 50)',
                },
            ]}
            onPress={() => onPress(seat_id)}
            disabled={!isAvailable}
        >
            <Text style={styles.text}>
                {`${row}-${seat_number}`}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    seat: {
        width: 30,
        height: 30,
        margin: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderStyle: 'solid',
        borderWidth: 1,
    },
    text: {
        color: 'black',
        fontSize: 11,
        textAlign: 'center',
    },
});

export default Seat;
