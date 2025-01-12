import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import {login} from "../authAPI.js";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            await login(email, password);
            Toast.show({
                type: 'success',
                text1: 'Login successful',
                visibilityTime: 2000,
                position: 'top',
            });
            setTimeout(() => navigation.navigate('Spectacles'), 2000);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Invalid username or password.',
                visibilityTime: 4000,
                position: 'top',
            });
        }
    };

    const handleRegister = () => {
        navigation.navigate('Register'); // Przykład nawigacji do ekranu rejestracji
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.loginContainer}
            >
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Log in to your account</Text>
                <View style={styles.inputContainer}>
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
                        placeholder="Password"
                        placeholderTextColor="#AAAAAA"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>
                <Toast />
                <TouchableOpacity style={styles.registerLink} onPress={handleRegister}>
                    <Text style={styles.registerText}>
                        Don't have an account?{' '}
                        <Text style={styles.registerHighlight}>Register</Text>
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001F3F',
    },
    loginContainer: {
        flex: 1,
        backgroundColor: '#001F3F', // Ciemnoniebieski tło
        alignItems: 'center',
        justifyContent: 'center',
        width: Platform.select({
          web: '50%',
          default: '100%'
        }),
        margin: 'auto',
        padding: 20,
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
    registerLink: {
        marginTop: 10,
    },
    registerText: {
        color: '#AAAAAA', // Jasnoszary tekst
        fontSize: 14,
    },
    registerHighlight: {
        color: '#800000', // Czerwony akcent
        fontWeight: 'bold',
    },
});

export default LoginScreen;
