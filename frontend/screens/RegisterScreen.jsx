import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import {register} from "../authAPI.js";
import Toast from "react-native-toast-message";

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        try {
            await register(name, email, password, phone);
            Toast.show({
                type: 'success',
                text1: 'Registration successful',
                visibilityTime: 2000,
                position: 'top',
            });
            setTimeout(() => navigation.navigate('Spectacles'), 2000);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Registration failed',
                visibilityTime: 4000,
                position: 'top',
            });
        }
    };

    const handleLoginRedirect = () => {
        navigation.navigate('Login'); // Przykład nawigacji do ekranu logowania
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join us today!</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor="#AAAAAA"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#AAAAAA"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone number"
                        placeholderTextColor="#AAAAAA"
                        value={phone}
                        onChangeText={setPhone}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#AAAAAA"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#AAAAAA"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginLink} onPress={handleLoginRedirect}>
                    <Text style={styles.loginText}>
                        Already have an account?{' '}
                        <Text style={styles.loginHighlight}>Log In</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            <Toast/>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001F3F', // Ciemnoniebieski tło
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF', // Biały tekst
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#AAAAAA', // Jasnoszary tekst
        marginBottom: 30,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#002D62', // Ciemnoniebieski jaśniejszy niż tło
        color: '#FFFFFF', // Biały tekst
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#004080', // Subtelna ramka
    },
    button: {
        backgroundColor: '#800000', // Czerwony kolor
        paddingVertical: 15,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#800000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
    },
    buttonText: {
        color: '#FFFFFF', // Biały tekst
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginLink: {
        marginTop: 10,
    },
    loginText: {
        color: '#AAAAAA', // Jasnoszary tekst
        fontSize: 14,
    },
    loginHighlight: {
        color: '#800000', // Czerwony akcent
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
