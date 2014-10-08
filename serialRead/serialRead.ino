
#define baudrate 9600
void setup() {
  // put your setup code here, to run once:
 Serial.begin(baudrate);

}
String str= String("");
char character = 0; 
int x=0;
int y=0;

void loop() {

  
  if (Serial.available()>0){
    character = Serial.read();
    //Serial.print("I received: ");
    //Serial.println(character, DEC);
   
    //concat while not receive a ;
    if(character!=59){
      str.concat(character);
      
      //if received a , then this is the 'x' value      
      if (character==44){
        x=str.toInt(); 
        Serial.print("XXX:");
        Serial.println(x);
        str=String("");  // erase it
      }
    }
    else{
      //after the , the 'y' value comes
      y=str.toInt();
      Serial.print("YYY:");
      Serial.println(y);
      str=String("");
      Serial.print("ERRASED, need a new token :) \n");
    }
  
    //Serial.println(i);
  }
  else{
    
   // str=String("");
  }
  

}


