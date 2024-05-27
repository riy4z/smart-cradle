import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AuthStackNavigator from './navigation';
import { NavigationContainer } from '@react-navigation/native';
import HomePage from "./HomePage.js"
import LiveStream from './LiveStream.js';

export default function App() {
  return (
    <NavigationContainer>
{/* <HomePage/> */}
{/* <LiveStream/> */}
      <AuthStackNavigator/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
