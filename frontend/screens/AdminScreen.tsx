import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addSpectacle, report } from "../adminAPI.ts";

const AdminScreen = () => {
    const [spectacleData, setSpectacleData] = useState({
        title: '',
        description: '',
        date: new Date(),
        duration: '',
        ticket_price_1_to_5: '',
        ticket_price_above_5: '',
        hall_name: '',
    });

    const [reportData, setReportData] = useState({
        start_date: new Date(),
        end_date: new Date(),
    });

    const [loading, setLoading] = useState(false);
    const [reportResult, setReportResult] = useState(null);

    // Add Spectacle Handler
    const handleAddSpectacle = async () => {
        if (Object.values(spectacleData).some(value => !value)) {
            Alert.alert("Validation Error", "Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            const accessToken = await AsyncStorage.getItem('access_token');
            const res = await addSpectacle(accessToken, spectacleData);
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
        if (!reportData.start_date || !reportData.end_date) {
            Alert.alert("Validation Error", "Please provide both start and end dates.");
            return;
        }

        setLoading(true);
        try {
            const accessToken = await AsyncStorage.getItem('access_token');
            const res = await report(reportData.start_date.toISOString().split('T')[0], reportData.end_date.toISOString().split('T')[0], accessToken);
            setReportResult(res); // Save result to state
        } catch (error) {
            Alert.alert("Error", "Failed to generate report.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (date, field) => {
        setSpectacleData({
            ...spectacleData,
            [field]: date,
        });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Admin Panel</Text>

            {/* Add Spectacle */}
            <Text style={styles.subtitle}>Add Spectacle</Text>
            {Object.keys(spectacleData).map((key) => (
                key !== 'date' ? (
                    <TextInput
                        key={key}
                        style={styles.input}
                        placeholder={key.replace('_', ' ').toUpperCase()}
                        value={spectacleData[key]}
                        onChangeText={(value) =>
                            setSpectacleData({ ...spectacleData, [key]: value })
                        }
                    />
                ) : (
                    <View key={key}>
                        {/* Implement a Date Picker here */}
                        <TextInput
                            style={styles.input}
                            placeholder="Date (YYYY-MM-DD)"
                            value={spectacleData[key].toISOString().split('T')[0]}
                            onChangeText={(value) => handleDateChange(new Date(value), key)}
                        />
                    </View>
                )
            ))}
            <Button title="Add Spectacle" onPress={handleAddSpectacle} />

            {/* Generate Report */}
            <Text style={styles.subtitle}>Generate Report</Text>
            <TextInput
                style={styles.input}
                placeholder="Start Date (YYYY-MM-DD)"
                value={reportData.start_date.toISOString().split('T')[0]}
                onChangeText={(value) =>
                    setReportData({ ...reportData, start_date: new Date(value) })
                }
            />
            <TextInput
                style={styles.input}
                placeholder="End Date (YYYY-MM-DD)"
                value={reportData.end_date.toISOString().split('T')[0]}
                onChangeText={(value) =>
                    setReportData({ ...reportData, end_date: new Date(value) })
                }
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
