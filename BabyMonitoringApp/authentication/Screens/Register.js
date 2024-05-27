import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Modal, Alert, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import avatar from '../assets/avatar.png';
import { registerValidation } from '../helper/validate';
import { registerUser, verifyOTPbyEmail, generateOTPbyEmail } from '../helper/helper';
import Toast from "react-native-toast-message";
import addButton from "./assets/add-button.png";


const Register = () => {
  const navigation = useNavigation();
  const [file, setFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerificationVisible, setVerificationVisible] = useState(false);
  const [isRegisterVisible, setRegisterVisible] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  
  const showToast = (message) => {
    Toast.show({
      type: 'default', // 'success', 'error', 'info', or 'custom'
      position: 'bottom', // 'top', 'bottom', 'center', or 'custom'
      text1: message,
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  };
  const checkEmailExistence = async () => {
    const { error: emailError } = await registerUser({
      email: formData.email,
      password: '',
    });
  
    if (emailError && emailError.includes('email')) {
      showToast('Email already exists. Please use a different email.'); // Use showToast instead of Toast.show
      return false;
    }
  
    return true;
  };

  const handleVerifyEmail = async () => {
    // Validate the formData before proceeding
    const validationErrors = await registerValidation(formData);
    if (Object.keys(validationErrors).length > 0) {
      // Handle validation errors, e.g., display error messages
      console.log('Validation errors:', validationErrors);
      return;
    }
  
    // Continue with email verification logic
    try {
      const isEmailValid = await checkEmailExistence();
      if (isEmailValid) {
        setVerificationVisible(true);
      }
    } catch (error) {
      console.error('Error verifying email:', error);
    }
  };



  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async () => {
    // Validate the formData before proceeding
    const validationErrors = await registerValidation(formData);
    if (Object.keys(validationErrors).length > 0) {
      // Handle validation errors, e.g., display error messages
      console.log('Validation errors:', validationErrors);
      return;
    }
  
    // Continue with registration logic
    try {
      const response = await registerUser({
        username: formData.username,
        password: formData.password,
        email: formData.email,
      });
  
      if (response.error) {
        // Handle registration error
        Alert.alert('Registration Failed', response.error);
      } else {
        console.log('Registered Successfully...!');
        setRegisterVisible(true);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.log(error.message || 'Registration failed. Please try again.');
    }
  };

  useEffect(() => {
    if (isVerificationVisible) {
      generateOTPbyEmail(formData.email).then((OTP) => {
        if (OTP) {
          showToast('OTP has been sent to your email');
        } else {
          Alert.alert('Problem while generating OTP');
        }
      });
    }
  }, [formData.email, isVerificationVisible]);

  const handleVerifyOTP = async () => {
    // Implement OTP verification logic here
    try {
      const response = await verifyOTPbyEmail({
        email: formData.email,
        code: enteredOTP,
      });

      if (response.status === 201) {
        // OTP is correct, proceed with registration or any other action
        setRegisterVisible(true);
        setVerificationVisible(false);
        setIsEmailVerified(true);
      } else {
        // OTP is incorrect, show an error message
        showToast('Invalid OTP. Please enter a valid OTP.');
      }
    } catch (error) {
      // Handle any error that occurred during OTP verification
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Error verifying OTP. Please try again.');
    }
  };

  function resendOTP(){
     generateOTPbyEmail(formData.email);
     showToast('OTP is resent!');
     
  }

  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ImageBackground>
      <Image source={file ? { uri: file } : avatar} style={styles.avatarImage} />
      <TouchableOpacity style={styles.addButton}>
          <Image style={styles.addButtonIcon} source={addButton} />
        </TouchableOpacity>
      </ImageBackground>
      <TextInput
        placeholder="Username*"
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10, width: 200 }}
        value={formData.username}
        onChangeText={(text) => setFormData({ ...formData, username: text })}
      />

      <TextInput
        placeholder="Password*"
        secureTextEntry={!showPassword}
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10, width: 200 }}
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />

      <TextInput
        placeholder="Email*"
        editable={!isEmailVerified}
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, margin: 10, width: 200 }}
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />

      <TouchableOpacity onPress={handleTogglePassword} style={{ margin: 10 }}>
        <Text>{showPassword ? 'Hide Password' : 'Show Password'}</Text>
      </TouchableOpacity>

      {isRegisterVisible && (
        <TouchableOpacity
          onPress={handleRegister}
          style={{ backgroundColor: 'blue', padding: 10, margin: 10, borderRadius: 5 }}
        >
          <Text style={{ color: 'white' }}>Register</Text>
        </TouchableOpacity>
      )}

      {/* Verification Modal */}
      <Modal visible={isVerificationVisible} animationType="slide" transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Verify OTP</Text>
            <Text>Enter the OTP sent to your email address.</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                padding: 10,
                marginVertical: 10,
                width: 200,
              }}
              placeholder="OTP*"
              value={enteredOTP}
              onChangeText={(text) => setEnteredOTP(text)}
            />
            <TouchableOpacity onPress={handleVerifyOTP} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginVertical: 10 }}>
              <Text style={{ color: 'white' }}>Verify</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={resendOTP} style={{ backgroundColor: 'green', padding: 10, borderRadius: 5, marginVertical: 10 }}>
              <Text style={{ color: 'white' }}>Resend OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setVerificationVisible(false)} style={{ backgroundColor: 'red', padding: 10, borderRadius: 5 }}>
              <Text style={{ color: 'white' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Verify Email Button */}
      {!isVerificationVisible && !isRegisterVisible && (
        <TouchableOpacity
          onPress={handleVerifyEmail}
          style={{ backgroundColor: 'green', padding: 10, margin: 10, borderRadius: 5 }}
        >
          <Text style={{ color: 'white' }}>Verify Email</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  avatar: {
    alignItems: 'center',
    marginTop: '40%',
  },
  avatarImage: {
    height: 260,
    width: 260,
    overflow: 'hidden',
    borderColor: '#ffffff',
    borderWidth: 4,
    borderRadius: 260 / 2,
  },
  addButton: {
    height: 54,
    width: 54,
    backgroundColor: '#f2f2fC',
    borderRadius: 50,
    position: 'absolute',
    right: 104,
    bottom: 40,
  },
  addButtonIcon: {
    height: 54,
    width: 54,
  },
  usernameText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 12,
  },
});

export default Register;
