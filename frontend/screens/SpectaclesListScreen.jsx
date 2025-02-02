import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Platform} from 'react-native';
import axios from 'axios';
import urlAPI from '../urlAPI';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {logout} from "../authAPI.js";
import Toast from "react-native-toast-message";

const SpectaclesListScreen = ({ navigation }) => {
  const [spectacles, setSpectacles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permission, setPermission] = useState(null);

  useEffect(() => {
      const checkPermission = async () => {
        const per = await AsyncStorage.getItem('permission');
        setPermission(per);
      };
      checkPermission().then();
    const fetchSpectacles = async () => {
      try {
        const response = await axios.get(`${urlAPI}:5000/spectacles/`);
        setSpectacles(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (axios.isAxiosError(error)) {
          setError(`Response error: ${error.response?.status} - ${error.response?.data}`);
        } else {
          setError('Unexpected error occurred');
        }
      }
    };
    fetchSpectacles().then();
  }, []);

  const handleLogout = () => {
    logout().then(() => setPermission(null));
    Toast.show({
      type: 'success',
      text1: 'Logged out',
      visibilityTime: 2000,
      position: 'top',
    });
  }

  // Funkcja do formatowania daty
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString('en-GB', options);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#800000" />
        <Text style={styles.loadingText}>Loading spectacles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <View style={styles.authButtonsContainer}>
          {permission !== null ? (
              <TouchableOpacity
                  style={styles.authButton}
                  onPress={() => {handleLogout()}}
              >
                <Text style={styles.authButtonText}>Logout</Text>
              </TouchableOpacity>
          ) : (
              <TouchableOpacity
                  style={styles.authButton}
                  onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.authButtonText}>Login</Text>
              </TouchableOpacity>
          )}
          {permission === "admin" && (
              <TouchableOpacity
                  style={styles.authButton}
                  onPress={() => navigation.navigate('Admin')}
              >
                <Text style={styles.authButtonText}>Admin</Text>
              </TouchableOpacity>
          )}
          <TouchableOpacity
              style={styles.authButton}
              onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.authButtonText}>Register</Text>
          </TouchableOpacity>
        </View>

        <FlatList
            data={spectacles}
            keyExtractor={(item) => item.spectacle_id}
            renderItem={({ item }) => (
                <View style={styles.spectacleItem}>
                  <Text style={styles.spectacleTitle}>{item.title ?? 'No Title'}</Text>
                  {item.date && (
                      <Text style={styles.spectacleDateTime}>
                        {formatDate(item.date)}
                      </Text>
                  )}
                  <Text style={styles.spectacleDescription}>{item.description ?? 'No Description'}</Text>
                  <TouchableOpacity
                      style={styles.selectButton}
                      onPress={() => navigation.navigate('Reservation', { spectacleId: item.spectacle_id })}
                  >
                    <Text style={styles.selectButtonText}>Select Seats</Text>
                  </TouchableOpacity>
                </View>
            )}
        />
      </View>
      <Toast/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001F3F',
    overflowY: Platform.select({
      web: 'auto',
      default: 'hidden',
    }),
    maxHeight: '100vh'
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#001F3F',
    width: Platform.select({
      web: '50%',
      default: '100%'
    }),
    margin: 'auto',
    marginBottom: 50
  },
  authButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 30,
  },
  authButton: {
    backgroundColor: '#800000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  authButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  spectacleItem: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#002D62',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  spectacleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  spectacleDateTime: {
    marginTop: 5,
    color: '#FF4136', // Czerwony kolor dla daty i godziny
    fontSize: 16,
    fontWeight: 'bold',
  },
  spectacleDescription: {
    marginTop: 10,
    color: '#CCCCCC',
  },
  selectButton: {
    marginTop: 15,
    paddingVertical: 12,
    backgroundColor: '#800000', // Ciemniejszy czerwony
    borderRadius: 5,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FFFFFF',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SpectaclesListScreen;
