import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addSpectacle, report } from "../adminAPI.ts";

const AdminScreen = () => {
    // Spectacle fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [duration, setDuration] = useState(0);
    const [ticketPrice1To5, setTicketPrice1To5] = useState(0.0);
    const [ticketPriceAbove5, setTicketPriceAbove5] = useState(0.0);
    const [hallName, setHallName] = useState('');

    // Report fields
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [loading, setLoading] = useState(false);
    const [reportResult, setReportResult] = useState(null);

    // Add Spectacle Handler
    const handleAddSpectacle = async () => {
        if (!title || !description || !date || !duration || !ticketPrice1To5 || !ticketPriceAbove5 || !hallName) {
            Alert.alert("Validation Error", "Please fill in all fields.");
            return;
        }

        const spectacleData = {
            title,
            description,
            date,
            duration,
            ticket_price_1_to_5: ticketPrice1To5,
            ticket_price_above_5: ticketPriceAbove5,
            hall_name: hallName,
        };

        setLoading(true);
        try {
            const accessToken = await AsyncStorage.getItem('access_token');
            const res = await addSpectacle(spectacleData, accessToken);
            Alert.alert("Success", "Spectacle added successfully.");
            console.log(res);
        } catch (error) {
            Alert.alert("Error", "Failed to add spectacle.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Generate Report Handler
    const handleGenerateReport = async () => {
        console.log(startDate);
        console.log(endDate);
        try {
            const res = await report(startDate, endDate, "test");
            console.log(res);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Admin Panel</Text>

            {/* Add Spectacle */}
            <Text style={styles.subtitle}>Add Spectacle</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                style={styles.input}
                placeholder="Date (YYYY-MM-DD)"
                value={date}
                onChangeText={setDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Duration (in minutes)"
                value={String(duration)} // Zmieniamy na string, aby TextInput mógł działać
                keyboardType="numeric"
                onChangeText={(text) => setDuration(text ? parseFloat(text) || 0 : 0)} // Jeżeli pusty tekst, przypisujemy 0
            />
            <TextInput
                style={styles.input}
                placeholder="Ticket Price (1-5)"
                value={String(ticketPrice1To5)}
                keyboardType="numeric"
                onChangeText={(text) => setTicketPrice1To5(text ? parseFloat(text) || 0 : 0)} // Podobnie jak wyżej
            />
            <TextInput
                style={styles.input}
                placeholder="Ticket Price (Above 5)"
                value={String(ticketPriceAbove5)}
                keyboardType="numeric"
                onChangeText={(text) => setTicketPriceAbove5(text ? parseFloat(text) || 0 : 0)} // Podobnie jak wyżej
            />
            <TextInput
                style={styles.input}
                placeholder="Hall Name"
                value={hallName}
                onChangeText={setHallName}
            />
            <Button title="Add Spectacle" onPress={handleAddSpectacle} />

            {/* Generate Report */}
            <Text style={styles.subtitle}>Generate Report</Text>
            <TextInput
                style={styles.input}
                placeholder="Start Date (YYYY-MM-DD)"
                value={startDate}
                onChangeText={setStartDate}
            />
            <TextInput
                style={styles.input}
                placeholder="End Date (YYYY-MM-DD)"
                value={endDate}
                onChangeText={setEndDate}
            />
            <Button title="Generate Report" onPress={handleGenerateReport} />

            {/* Loading Indicator */}
            {loading && <ActivityIndicator size="large" color="#0000ff" />}

            {/* Display Report Results */}
            {reportResult && (
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.subtitle}>Report Results:</Text>
                    <Text>{JSON.stringify(reportResult, null, 2)}</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default AdminScreen;
