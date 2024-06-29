#include <WiFi.h>
#include <WebSocketsServer.h>

const char* ssid = "NameRedWifi";
const char* password = "********";

WebSocketsServer webSocket = WebSocketsServer(300); // Puerto 81 para el servidor WebSocket

const int buttonPin = 2; // Pin del botón
const int interPin = 12;
const int Led = 4;
uint8_t cliend_id;
int estadoButton = 0;
int estadoAnteriorButton = 0; 
bool estadoLed = false;

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  cliend_id = num;
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Desconectado!\n", num);
      break;
    case WStype_CONNECTED:
      {
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Conectado desde %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
      }
      break;
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Conectado a ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);

  pinMode(buttonPin, INPUT); // Configura el pin del botón como entrada con pull-up
  pinMode(Led, OUTPUT);
  pinMode(interPin, INPUT);
}

void loop() {
  webSocket.loop();
  estadoButton = digitalRead(buttonPin);

  if (estadoButton != estadoAnteriorButton){
    if(estadoButton == HIGH){
        estadoLed = !estadoLed;
        digitalWrite(Led, estadoLed ? HIGH : LOW);
        estadoLed ? webSocket.broadcastTXT("Play") : webSocket.broadcastTXT("Pausa");
    }
  
  }

   estadoAnteriorButton =  estadoButton;

 
  if (digitalRead(interPin) == HIGH){
    webSocket.disconnect(cliend_id);
  } else {
     webSocket.onEvent(webSocketEvent);
  }
   
}
  

