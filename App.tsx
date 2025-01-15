import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { RegisterScreen } from './src/screens/auth/RegisterScreen';
import { RoomListScreen } from './src/screens/customer/RoomListScreen';
import { BookRoomScreen } from './src/screens/customer/BookRoomScreen';
import { ComplaintScreen } from './src/screens/customer/ComplaintScreen';
import { StaffDashboardScreen } from './src/screens/staff/StaffDashboardScreen';
import { AdminDashboardScreen } from './src/screens/admin/AdminDashboardScreen';
import { LogoutButton } from './src/components/LogoutButton';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="RoomList" 
          component={RoomListScreen}
          options={{ 
            title: 'Available Rooms',
            headerRight: () => <LogoutButton />
          }}
        />
        <Stack.Screen 
          name="BookRoom" 
          component={BookRoomScreen}
          options={{ 
            title: 'Book Room',
            headerRight: () => <LogoutButton />
          }}
        />
        <Stack.Screen 
          name="Complaint" 
          component={ComplaintScreen}
          options={{ 
            title: 'Submit Complaint',
            headerRight: () => <LogoutButton />
          }}
        />
        <Stack.Screen 
          name="StaffDashboard" 
          component={StaffDashboardScreen}
          options={{ 
            title: 'Staff Dashboard',
            headerRight: () => <LogoutButton />
          }}
        />
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboardScreen}
          options={{ 
            title: 'Admin Dashboard',
            headerRight: () => <LogoutButton />
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}