import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    ScrollView,
    Platform,
    TouchableOpacity
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addSpectacle, report } from "../adminAPI.js";
import Toast from "react-native-toast-message";
import {refresh} from "../authAPI.js";

const AdminScreen = ({ route, navigation }) => {
    // Spectacle fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [duration, setDuration] = useState('');
    const [ticketPrice1To5, setTicketPrice1To5] = useState('');
    const [ticketPriceAbove5, setTicketPriceAbove5] = useState('');
    const [hallName, setHallName] = useState('');

    // Report fields
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Add Spectacle Handler
    const handleAddSpectacle = async () => {
        if (!title || !description || !date || !duration || !ticketPrice1To5 || !ticketPriceAbove5 || !hallName) {
            Alert.alert("Validation Error", "Please fill in all fields.");
            return;
        }
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            await addSpectacle(accessToken, title, description, date, duration, ticketPrice1To5, ticketPriceAbove5, hallName);
            Toast.show({
                type: 'success',
                text1: 'Spectacle added successfully',
                visibilityTime: 2000,
                position: 'top',
            });
        } catch (error) {
            console.error(error);
        }
    };

    // Generate Report Handler
    const handleGenerateReport = async () => {
        try {
            const accessToken = await AsyncStorage.getItem("accessToken")
            let response = await report(startDate, endDate, accessToken);
            console.log(response.status)
            if (response.status === 422) {
                response = await refresh(report, startDate, endDate, accessToken)
                console.log(response.status)
            }
            navigation.navigate('Report', { data: response.data })
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.dataContainer}>
                <Text style={styles.title}>Admin Panel</Text>

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
                    placeholder="Date (YYYY-MM-DDTHH:MM:SS)"
                    value={date}
                    onChangeText={setDate}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Duration (in minutes)"
                    value={String(duration)}
                    onChangeText={(text) => setDuration(text ? parseInt(text) || 0 : 0)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Ticket Price (1-5)"
                    value={String(ticketPrice1To5)}
                    onChangeText={(text) => setTicketPrice1To5(text ? parseFloat(text) || 0 : 0)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Ticket Price (Above 5)"
                    value={String(ticketPriceAbove5)}
                    onChangeText={(text) => setTicketPriceAbove5(text ? parseFloat(text) || 0 : 0)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Hall Name"
                    value={hallName}
                    onChangeText={setHallName}
                />
                <TouchableOpacity style={styles.selectButton} onPress={handleAddSpectacle}>
                    <Text style={styles.selectButtonText}>Add Spectacle</Text>
                </TouchableOpacity>

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
                <TouchableOpacity style={styles.selectButton} onPress={handleGenerateReport}>
                    <Text style={styles.selectButtonText}>Generate Report</Text>
                </TouchableOpacity>
                <Toast/>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001F3F',
    },
    dataContainer: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#001F3F',
        width: Platform.select({
          web: '50%',
          default: '100%'
        }),
        margin: 'auto',
        marginBottom: 50,
        overflowY: Platform.select({
          web: 'auto',
          default: 'hidden'
        }),
        maxHeight: '100vh',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#002D62',
        color: '#FFFFFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    selectButton: {
        backgroundColor: '#800000',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    selectButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    spectacleItem: {
        padding: 20,
        marginBottom: 20,
        backgroundColor: '#002D62',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#FFFFFF',
    },
});

export default AdminScreen;
