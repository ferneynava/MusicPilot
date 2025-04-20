#include <WiFi.h>
#include <FirebaseESP32.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

const char* ssid = "******";
const char* password = "******";

#define FIREBASE_HOST "musicpilot-362fb-default-rtdb.firebaseio.com"
#define FIREBASE_API_KEY "**********"

#define USER_EMAIL "*************"
#define USER_PASSWORD "*****************"

FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

const int buttonPin = 2; // Pin del botón
const int Led = 4;
uint8_t cliend_id;
int estadoButton = 0;
int estadoAnteriorButton = 0; 
bool estadoLed = false;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
    Serial.println("Conectado a la WiFi.");


    // Configurar Firebase
  config.api_key = FIREBASE_API_KEY;
  config.database_url = FIREBASE_HOST;

  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  config.token_status_callback = tokenStatusCallback; 

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  if(Firebase.ready()){
    if (Firebase.setString(firebaseData, "/musicpilot/reproductor", " ")) {
      Serial.println("Message sent: " + String(" "));
    }
  }
  pinMode(buttonPin, INPUT); // Configura el pin del botón como entrada con pull-up
  pinMode(Led, OUTPUT);
  digitalWrite(Led, LOW);
}

void sendFirebaseMessage(const char* message) {
  if (Firebase.ready()) {
    if (Firebase.setString(firebaseData, "/musicpilot/reproductor", message)) {
      Serial.println("Message sent: " + String(message));
    } else {
      Serial.println("Error sending message: " + firebaseData.errorReason());
    }
  } 
}

void loop() {
   if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Desconectado de WiFi. Reconectando...");
    reconectarWiFi();
    }

    if(!Firebase.ready()){
      Serial.println("Desconectado de Firebase. Reconectando...");
      reconectarFirebase();
    } 

  estadoButton = digitalRead(buttonPin);

  if (estadoButton != estadoAnteriorButton){
    if(estadoButton == HIGH){
        estadoLed = !estadoLed;
        digitalWrite(Led, estadoLed ? HIGH : LOW);
        estadoLed ? sendFirebaseMessage("Play") : sendFirebaseMessage("Pausa");;
    }
    estadoAnteriorButton =  estadoButton;
  }

}

void reconectarWiFi(){
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Reconectado a WiFi.");
}

void reconectarFirebase(){
  config.token_status_callback = tokenStatusCallback; 
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  // Espera hasta que Firebase esté listo
  while (!Firebase.ready()) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Reconectado a Firebase.");
}
