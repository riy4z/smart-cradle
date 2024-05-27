import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { verifyPassword } from '../helper/helper';
import api from '../../Components/api';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const navigation = useNavigation();
  const [getData, setData, clearAsyncStorage] = useState('');


  useFocusEffect(
    React.useCallback(() => {
      // This function will be called each time the component gains focus
      checkLoginStatus();
    }, [])
  );

  const checkLoginStatus = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (storedData) {
        // User is already logged in, navigate to HomeTabs
        navigation.replace('HomeTabs');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await verifyPassword({ username, password });

      if (response.data) {
        const { data } = await api.get(`/user/${username}`);
        await AsyncStorage.setItem('userData', JSON.stringify(data));
        setData({ apiData: data, isLoading: false });
        navigation.navigate('HomeTabs');
      } else {
        setLoginMessage('bye');
        Alert.alert('Login failed', 'Username or password is incorrect');
      }
    } catch (error) {
      console.error('Error during login:', error.error);
      setLoginMessage('bye');
      Alert.alert('Login failed', error.error);
    }
  };

  const handleForgotPassword = () => {
    // Add navigation logic to the recovery page here
    navigation.navigate('Recovery'); // Replace 'RecoveryPage' with the actual route name
  };

  const handleSignUp = () => {
    navigation.navigate('Register')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.loginMessage}>{loginMessage}</Text>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
       
      <Text style={styles.signupText}>
        Don't have an account?{' '}
       <TouchableOpacity onPress={handleSignUp}>
        <Text style={styles.signupLink}>Sign up here</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  loginButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: 10,
    color: '#3498db',
  },
  signupText: {
    marginTop: 20,
    color: 'gray',
  },
  signupLink: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  loginMessage: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green', // You can customize the color
  },
});


export default LoginPage;
