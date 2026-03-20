import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import LandingScreen from './src/screens/Auth/LandingScreen';
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import PatientDashboard from './src/screens/Patient/PatientDashboard';
import AppointmentScreen from './src/screens/Patient/AppointmentScreen';
import ReportScreen from './src/screens/Patient/ReportScreen';
import BookingScreen from './src/screens/Patient/BookingScreen';
import DoctorDashboard from './src/screens/Doctor/DoctorDashboard';
import DoctorAppointmentScreen from './src/screens/Doctor/DoctorAppointmentScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="PatientDashboard" component={PatientDashboard} />
        <Stack.Screen name="Appointments" component={AppointmentScreen} />
        <Stack.Screen name="Reports" component={ReportScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} />
        <Stack.Screen name="DrAppointments" component={DoctorAppointmentScreen} />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
