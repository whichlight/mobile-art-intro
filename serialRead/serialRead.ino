
void setup() {
  Serial.begin(9600);
}

void loop() {
  // do nothing

  while(Serial.available() > 0)
  {
    int x = Serial.parseInt(); 
    int y = Serial.parseInt();
    
    if (Serial.read() == '\n') {
      Serial.println(x,DEC);
      Serial.println("");

    }

  }
}

