#define sound A1
#include <Servo.h>
#define wet A2

Servo servo1;  // Create a servo object for servo motor 1
Servo servo2;  // Create a servo object for servo motor 2
String a;
bool swing = true; // Flag to control swing

void setup() {
  Serial.begin(19200);
  pinMode(sound, INPUT);
  servo1.attach(9);  // Attaches servo motor 1 on pin 9 to the servo object
  servo2.attach(11);
  pinMode(wet,OUTPUT);
}

void loop() {
  int c = analogRead(sound);
  Serial.print("SOUND=");
  Serial.println(c);
  int b= analogRead(wet);
  Serial.print("WET=");
  Serial.println(b);
  delay(500);
  
  while(Serial.available() > 0){
    a = Serial.readString();
    Serial.println(a);
    if(a == "q") { // Check if 'q' received
      swing = false; // Stop swing
      break; // Exit the loop
    }
  }

  if (c > 110) {
    if(swing) {
      swingFunction(); // Call the swing function
    }
  }

  if (a == "s") {
    if(swing) {
      swingFunction(); // Call the swing function
    }
  }


  delay(1000);
}

// Function to control the swing motion
void swingFunction() {
  for (int i = 0; i < 2; i++) { // Swing motion repeated twice
    // Move the servo motors forward
    for (int angle = 90; angle <= 130; angle++) {
      servo1.write(angle);
      servo2.write(180 - angle); // Opposite angle for servo2
      delay(15);
      if(a == "q") { // Check if 'q' received
        swing = false; // Stop swing
        return;
      }
    }

    // Move the servo motors back to center
    for (int angle = 130; angle >= 90; angle--) {
      servo1.write(angle);
      servo2.write(180 - angle); // Opposite angle for servo2
      delay(15);
      if(a == "q") { // Check if 'q' received
        swing = false; // Stop swing
        return;
      }
    }

    // Move the servo motors backward
    for (int angle = 90; angle >= 50; angle--) {
      servo1.write(angle);
      servo2.write(180 - angle); // Opposite angle for servo2
      delay(15);
      if(a == "q") { // Check if 'q' received
        swing = false; // Stop swing
        return;
      }
    }

    // Move the servo motors back to center
    for (int angle = 50; angle <= 90; angle++) {
      servo1.write(angle);
      servo2.write(180 - angle); // Opposite angle for servo2
      delay(15);
      if(a == "q") { // Check if 'q' received
        swing = false; // Stop swing
        return;
      }
    }
  }
}

