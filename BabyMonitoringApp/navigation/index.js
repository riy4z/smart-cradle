import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from '../authentication/Screens/LoginPage';
import Register from '../authentication/Screens/Register';
import Recovery from '../authentication/Screens/Recovery';
import Reset from '../authentication/Screens/Reset';
import LiveStream from '../LiveStream';
import HomePage from "../HomePage"

const AuthStack = createNativeStackNavigator();

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      
      <AuthStack.Screen name="HomeTabs" component={HomePage} />
      <AuthStack.Screen name="LiveStream" component={LiveStream} />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
