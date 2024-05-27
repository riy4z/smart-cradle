import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { resetPassword } from '../helper/helper';
import { resetPasswordValidation } from '../helper/validate';

export default function Reset({ route, navigation }) {
  const { username } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    try {
      const errors = await resetPasswordValidation({ password, confirm_pwd: confirmPwd });
      if (Object.keys(errors).length > 0) {
        Alert.alert('Validation Error', 'Please fix the validation errors before submitting.');
        return;
      }

      const { data, status } = await resetPassword({ username, password });
      if (status === 201) {
        Alert.alert('Success', 'Password reset successfully', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Error', 'An error occurred during password reset');
      }
    } catch (error) {
      console.error('An error occurred during password reset:', error);
      Alert.alert('Error', 'An error occurred during password reset');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: '80%' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Reset</Text>
        <Text style={{ paddingTop: 16, fontSize: 18, textAlign: 'center', color: 'gray' }}>
          Enter new password.
        </Text>

        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={{ borderBottomWidth: 1, marginTop: 16, marginBottom: 8 }}
          secureTextEntry={!showPassword}
          placeholder="New Password"
        />

        <TextInput
          value={confirmPwd}
          onChangeText={(text) => setConfirmPwd(text)}
          style={{ borderBottomWidth: 1, marginBottom: 16 }}
          secureTextEntry={!showPassword}
          placeholder="Repeat Password"
        />

        <TouchableOpacity onPress={handleTogglePassword} style={{ alignSelf: 'flex-end' }}>
          <Text style={{ color: 'gray', marginBottom: 16 }}>
            {showPassword ? 'Hide Password' : 'Show Password'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: '#007BFF',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
