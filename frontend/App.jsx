import './gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SpectaclesListScreen from './screens/SpectaclesListScreen';
import SeatSelectionScreen from './screens/SeatSelectionScreen';
import AdminScreen from "./screens/AdminScreen.jsx";
import ReportScreen from "./screens/ReportScreen.jsx";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Spectacles">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Spectacles" component={SpectaclesListScreen} />
        <Stack.Screen name="Reservation" component={SeatSelectionScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
