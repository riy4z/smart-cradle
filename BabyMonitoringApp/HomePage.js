import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { firebaseConfig } from './firebaseConfig'; // Import the Firebase configuration
import { LineChart } from "react-native-gifted-charts";
import sensorData from './sensordata'; // Import sensor data

const IoTPage = () => {
  const [wetnessDetected, setWetnessDetected] = useState(false);
  const [babyCrying, setBabyCrying] = useState(false);
  const [Temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [motionDetected, setMotionDetected] = useState(false);
  const navigation = useNavigation();
  const [soundData, setSoundData] = useState(0);
  const [cryingData, setCryingData] = useState([]);
  
  useEffect(() => {
    // Filter sensor data for crying events and sound levels
    const filteredData = sensorData.filter(item => item.cry_detected === "True");

    // Format filtered data for LineChart
    const formattedData = filteredData.map(item => ({
      label:new Date(item.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), // Convert timestamp to a formatted date
      value: parseFloat(item.sound), // Convert sound level to float if necessary
    }));
    setCryingData(formattedData);
  }, []);
  
  console.log(cryingData)
  useEffect(() => {
    // Initialize Firebase app with the configuration
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    // Set up listeners for Firebase Realtime Database changes
    const wetnessRef = ref(db, 'arduino_data/wetness_detected');
    const babyCryingRef = ref(db, 'arduino_data/cry_detected');
    const TemperatureRef = ref(db, 'dht_data/temperature');
    const humidityRef = ref(db,"dht_data/humidity")
    

    const soundRef = ref(db, 'arduino_data/sound'); // Adjust the reference based on your database structure

    onValue(soundRef, snapshot => {
      setSoundData(snapshot.val());
    });

    // Listen for changes in Firebase Realtime Database and update state accordingly
    onValue(wetnessRef, snapshot => {
      setWetnessDetected(snapshot.val());
    });

    onValue(babyCryingRef, snapshot => {
      setBabyCrying(snapshot.val());
    });
    onValue(humidityRef, snapshot => {
      setHumidity(snapshot.val());
    });

    onValue(TemperatureRef, snapshot => {
      setTemperature(snapshot.val());
    });

    onValue(soundRef, snapshot => {
      setSoundData(snapshot.val());
    });

    return () => {
      // Clean up listeners when component unmounts
      // No need to detach listeners in this case
    };
  }, []);

  const swingCradle = async () => {
    // Initialize Firebase app with the configuration
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    
    const swingRef = ref(db, 'swingnow'); // Assuming 'swingNow' is the reference for swing status
    await set(swingRef, true); // Update swingNow to true in Firebase
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userData');
    navigation.navigate('Login');
  };

  const viewLiveStream = () => {
    // Navigate to the live stream page
    navigation.navigate('LiveStream');
  };

  const customXLabels = cryingData.map(data => data.x);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>IoT Smart Cradle</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Status</Text>
        <Text style={styles.status}>
          {wetnessDetected ? 'Wetness Detected' : 'No Wetness Detected'}
        </Text>
        <Text style={styles.status}>
          {babyCrying ? 'Baby is Crying' : 'Baby is Calm'}
        </Text>
        <Text style={styles.status}>Temperature: {Temperature}°C</Text>
        <Text style={styles.status}>Humidity: {humidity}%</Text>
        <Text style={styles.status}>Sound: {soundData}
        </Text>
       

        <TouchableOpacity onPress={viewLiveStream} style={styles.link}>
          <Text style={styles.linkText}>View Live Stream</Text>
        </TouchableOpacity>
        <View>
        <LineChart
          data={cryingData}
          isAnimated
          color="rgba(84,219,234,0.9)"
          dataPointsColor='gray'
          curved
          startOpacity={0.8}
          endOpacity={0.3}
          yAxisTextStyle={{color: 'gray'}}
          xAxisTextStyle={{color: 'gray'}}
          thickness={3}
          startFillColor={'rgb(84,219,234)'}
          endFillColor={'rgb(84,219,234)'}
          yAxisProps={{ min: 0, max: 100 }} // Adjust min and max values for y-axis (sound levels)
          xAxisProps={{ min: 0, max: cryingData.length - 1, labels: customXLabels }} // Adjust min and max values for x-axis (dates) and add custom labels
          areaChart
          noOfSections={4}
        />
        </View>
      </View>
      <TouchableOpacity onPress={swingCradle} style={styles.SwingButton}>
        <Text style={styles.logoutText}>Swing Cradle(1 min)</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    marginTop:40,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    marginBottom: 20,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  chartContainer: {
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    marginBottom: 5,
    padding: 5,
  },
  link: {
    marginTop: 10,
    alignSelf: 'center',
  },
  linkText: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
  SwingButton: {
    backgroundColor: 'blue',
    padding: 10,
    marginBottom:10,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default IoTPage;
