import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import { authenticate, generateOTP, verifyOTP } from '../helper/helper';

export default function Recovery({ navigation }) {
  const [username, setUsername] = useState('');
  const [OTP, setOTP] = useState('');

  async function handleUsernameValidation() {
    try {
        if (!username.trim()) {
        Alert.alert('Empty Username', 'Enter a valid username before validation.');
        return;
      }
      const isValid = await authenticate(username);

      if (isValid) {
        // Username is valid, send OTP to the user's email
        await generateAndSendOTP(username);
      } else {
        // Username is not valid, show an error message
        Alert.alert('Invalid Username', 'Please enter a valid username.');
      }
    } catch (error) {
      // Handle error, e.g., show an error toast or message
      console.error('Error validating username:', error);
    }
  }

  async function generateAndSendOTP(username) {
    try {
      const generatedOTP = await generateOTP(username);

      if (generatedOTP) {
        // Handle success, e.g., show a success message
        Alert.alert('OTP Sent', 'OTP has been sent to your email.');
      } else {
        // Handle error, e.g., show an error message
        Alert.alert('Error', 'Could not send OTP.');
      }
    } catch (error) {
      // Handle error, e.g., show an error toast or message
      console.error('Error generating and sending OTP:', error);
    }
  }

  async function onSubmit() {
    try {
      const { status } = await verifyOTP({ username, code: OTP });

      if (status === 201) {
        // Verification success, navigate to the reset screen
        navigation.navigate('Reset', { username });
      }
    } catch (error) {
      // Handle error, e.g., show an error toast or message
      Alert.alert('Wrong OTP', 'Check your email again and enter the correct OTP.');
    }
  }

  function resendOTP() {
    generateAndSendOTP(username);
  }

  return (
    <View style={styles.container}>
      <View style={styles.glass}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Recovery</Text>
          <Text style={styles.description}>
            Enter OTP to recover password
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Enter your username
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setUsername(text)}
              placeholder="Username"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleUsernameValidation}>
            <Text style={styles.buttonText}>Validate Username</Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Enter 6 digit OTP sent to your email address.
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setOTP(text)}
              placeholder="OTP"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text style={styles.buttonText}>Recover</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
    Can't get OTP?
  </Text>
  <Button title="Resend" onPress={resendOTP} style={styles.resendButton} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    color: '#3498db',
    textDecorationLine: 'underline', 
  },
  resendButton: {
    marginTop: 5,
  },
});
