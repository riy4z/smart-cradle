import cv2
import serial
import threading
import time
import Adafruit_DHT
import firebase_admin
from firebase_admin import credentials, db
import time
import pygame
from flask import Flask, Response

app = Flask(__name__)
# Define timeout durations (in seconds)
WETNESS_TIMEOUT = 60  # 1 minute
CRY_TIMEOUT = 60      # 1 minute

# Define variables to track last detection times
last_wetness_detection_time = time.time()
last_cry_detection_time = time.time()

# Set the sensor type and GPIO pin number
sensor = Adafruit_DHT.DHT11
gpio_pin = 4  # Use the actual GPIO pin number where the sensor is connected

# Establish serial connection with Arduino
ser = serial.Serial('/dev/ttyACM0', 19200)  # Change '/dev/ttyUSB0' to your Arduino's port

# Initialize Firebase Admin SDK
cred = credentials.Certificate('/home/pi/Desktop/cradle.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://smart-cradle-327e9-default-rtdb.asia-southeast1.firebasedatabase.app/'
})

# Get a reference to the Firebase Realtime Database
ref = db.reference('/')

def check_swingnow():
    last_swingnow = None  # Variable to store the last value of swingnow
    start_time = None  # Initialize start_time to None
    while True:
        swingnow_ref = db.reference('/swingnow')
        swingnow = swingnow_ref.get()
        if swingnow != last_swingnow:  # Check if swingnow value has changed
            if swingnow == True:
                print("Swinging")
                ser.write(b's')  # Send serial data
                swingnow_ref.set(False)
                start_time = time.time()  # Reset start time upon swinging
            last_swingnow = swingnow  # Update last_swingnow with the new value
        
        # Check if 10 seconds have elapsed since swinging
        if start_time is not None and time.time() - start_time > 60:
            print("Stopping swing")
            ser.write(b'q')  # Send 'q' command to stop swinging
            start_time = None  # Reset start_time
            continue  # Continue the loop to check if swingnow has changed again
        
        time.sleep(3)  # Wait for 3 seconds before checking again
        
# Initialize pygame mixer
pygame.mixer.init()

def play_audio_file(file_path):
    # Load the audio file
    pygame.mixer.music.load(file_path)
    # Play the audio file
    pygame.mixer.music.play()


def read_arduino():
    global last_wetness_detection_time, last_cry_detection_time, cry_detected_start_time, wetness_detected_start_time
    cry_detected_start_time = None
    wetness_detected_start_time = None
    audio_playing = False
    
    while True:
        if ser.in_waiting > 0:
            try:
                data = ser.readline().decode('utf-8').rstrip()
                print(data)
                
                if data.startswith("WET="):
                    wetness = int(data[len("WET="):])
                    ref.child('arduino_data').child('wetness').set(wetness)
                    if wetness > 15:
                        if wetness_detected_start_time is None:
                            wetness_detected_start_time = time.time()
                        ref.child('arduino_data').child('wetness_detected').set(True)
                    else:
                        wetness_detected_start_time = None
                        ref.child('arduino_data').child('wetness_detected').set(False)
                    
                    if wetness_detected_start_time is not None and time.time() - wetness_detected_start_time > 30:
                        ref.child('arduino_data').child('wetness_detected').set(False)
                        wetness_detected_start_time = None
                    
                elif data.startswith("SOUND="):
                    sound_level = int(data[len("SOUND="):])
                    ref.child('arduino_data').child('sound').set(sound_level)
                    if sound_level > 110:
                        if cry_detected_start_time is None:
                            cry_detected_start_time = time.time()
                            # Play the audio file only if it's not already playing
                            if not audio_playing:
                                play_audio_file("lullaby.mp3")
                                audio_playing = True
                        ref.child('arduino_data').child('cry_detected').set(True)
                    else:
                        cry_detected_start_time = None
                        ref.child('arduino_data').child('cry_detected').set(False)
                        audio_playing = False
                        
                    if cry_detected_start_time is not None and time.time() - cry_detected_start_time > 30:
                        ref.child('arduino_data').child('cry_detected').set(False)
                        cry_detected_start_time = None
                        audio_playing = False
                
                time.sleep(0.1)                
            except UnicodeDecodeError as e:
                print("UnicodeDecodeError:", e)
                # Optionally, you can print the problematic data
                print("Problematic Data:", ser.readline())

def read_dht_sensor():
    while True:
        # Try to read data from the DHT sensor
        humidity, temperature = Adafruit_DHT.read_retry(sensor, gpio_pin)

        if humidity is not None and temperature is not None:
            #print(f'Temperature: {temperature:.2f} °C')
            #print(f'Humidity: {humidity:.2f} %')
            # Send data to Firebase
            ref.child('dht_data').set({'temperature': temperature, 'humidity': humidity})
        else:
            print('Failed to retrieve data from the sensor')


def generate_frames():
    camera = cv2.VideoCapture(0)
    while True:
        # Capture frame-by-frame
        success, frame = camera.read()  # read the camera frame
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result


@app.route('/')
def index():
    return "Welcome to Smart Cradle"


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


# Create and start threads for reading Arduino, DHT sensor data
arduino_thread = threading.Thread(target=read_arduino)
dht_thread = threading.Thread(target=read_dht_sensor)
swing_thread = threading.Thread(target=check_swingnow)
live_thread = threading.Thread(target=generate_frames)
arduino_thread.start()
dht_thread.start()
swing_thread.start()
live_thread.start()
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True, threaded=True)

Cry detection:

from keras.models import load_model
from time import sleep
from keras.preprocessing.image import img_to_array
from keras.preprocessing import image
import cv2
import numpy as np


face_classifier = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

classifier =load_model('model.h5')

##### ARRAY WITH  THE EMOTION
emotion_labels = ['CRYING','CRYING','Fear','Happy','Neutral', 'CRYING', 'CRYING']
cap = cv2.VideoCapture(0)



while True:
    _, frame = cap.read()
    labels = []
    gray = cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)

   faces = face_classifier.detectMultiScale(gray)


    for (x,y,w,h) in faces:

        cv2.rectangle(frame,(x,y),(x+w,y+h),(0,255,255),2)

        roi_gray = gray[y:y+h,x:x+w]

        roi_gray = cv2.resize(roi_gray,(48,48),interpolation=cv2.INTER_AREA)

        if np.sum([roi_gray])!=0:

            roi = roi_gray.astype('float')/255.0

            roi = img_to_array(roi)

            roi = np.expand_dims(roi,axis=0)



            prediction = classifier.predict(roi)[0]

            label=emotion_labels[prediction.argmax()]

            label_position = (x,y)

            cv2.putText(frame,label,label_position,cv2.FONT_HERSHEY_SIMPLEX,1,(0,255,0),2)

        else:

            cv2.putText(frame,'No Faces',(30,80),cv2.FONT_HERSHEY_SIMPLEX,1,(0,255,0),2)
    cv2.imshow('Cry Detector',frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):

        break


cap.release()

cv2.destroyAllWindows()

