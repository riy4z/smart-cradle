# Smart Cradle System

An IoT-based smart cradle system designed to assist parents in monitoring and soothing their infants.

<img src="https://github.com/riy4z/smart-cradle/assets/56198819/bac79ea9-08b5-46d1-8266-f08595040fb1" width="600" height="400">


## Features

- **Remote Monitoring**: Constantly monitor the baby via sensors.
- **Notifications**: Receive alerts on your mobile device if the baby wakes up, cries, or wets the bed.
- **Automated Rocking**: Side-to-side rocking motion to soothe the baby using a geared motor system.
- **Environmental Monitoring**: Check temperature and humidity around the cradle.
- **Live Video Streaming**: View live video feed from the cradle's camera.
- **Cloud Storage**: Store and analyze data in real-time using Firebase.

## Components

- **Arduino Uno**: Microcontroller for managing sensors and motors.
- **Raspberry Pi**: For handling the camera and data processing.
- **Sound Sensor**: Detects baby’s cries.
- **Water Sensor**: Detects moisture indicating a wet diaper.
- **DHT11**: Measures temperature and humidity.
- **Pi Camera**: Captures live video feed.
- **Servo Motor**: Controls the rocking motion.
- **Power Supply Module**: Powers all the components.

## System Architecture

<img src="https://github.com/riy4z/smart-cradle/assets/56198819/3102e95c-3ebb-4ab1-8a0d-a6c3d55f12df" alt="System Architecture" width="600" height="400">

## Setup

1. **Arduino Uno**: Connect sensors and servo motor.
2. **Raspberry Pi**: Set up Pi Camera and connect to the Arduino.
3. **Sensors**: Attach sound, water, and DHT11 sensors to the Arduino.
4. **Power Supply**: Ensure a stable power source for all components.
5. **Mobile App**: Install the companion app on your mobile device to receive notifications and monitor data.


## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/riy4z/smart-cradle.git
    ```

2. Navigate to the project directory:
    ```bash
    cd smart-cradle
    ```

3. Set up the Arduino:
    - Upload the Arduino code from `smart_cradle/` directory to your Arduino Uno using Arduino IDE.

4. Set up the Raspberry Pi:
    - Run python script `cradle.py` in `Raspberry Pi Code/` directory to run the flask application and camera script.
    - Dependencies for python are cv2, serial, firebase_admin, pygame, flask
    - Run python script `main.py` in  `Cry Detection (ML)/` directory to run the Real Time Cry Detection Model.

5. Configure the mobile app:
    -  Navigate to the `BabyMonitoringApp/` directory to set up and configure the mobile application.
    -  Use `npm i` to install all the dependencies required for the react native application.
    -  Then use the command `npx expo start` to run the React Native Application
    -  Use Virtual Emulator or Expo go app from playstore to use the mobile application.
      
## Usage

1. Place the baby in the cradle.
2. Ensure all sensors and components are properly connected.
3. Use the mobile app to monitor real-time data and receive alerts.
4. Adjust cradle settings via the mobile app as needed.

## Screenshots
1. Mobile Application

<img src="https://github.com/riy4z/smart-cradle/assets/56198819/a383b7a7-ede2-498f-885e-3cc971eafba8" width="30%" >

2. Raspberry Pi Terminal

<img src="https://github.com/riy4z/smart-cradle/assets/56198819/a6a40c43-229c-48e5-b43e-e530006c8187" width="600" height="400">

3. Cry Detection Model

<img src="https://github.com/riy4z/smart-cradle/assets/56198819/649f4542-af2b-4967-a4cc-c9d3cbba53d5" width="600" >


## Note

Live Video Streaming is implemented using ngrok service, so setup ngrok service in the Raspberry Pi and tunnel the port 8080 to the internet


## Contact

For any inquiries or support, please contact Riyas Ahamed J at jriyazamd@gmail.com.
