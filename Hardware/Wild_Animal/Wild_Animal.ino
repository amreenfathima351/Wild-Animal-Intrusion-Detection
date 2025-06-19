#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define BUZZER_PIN D6  // D6 is GPIO12 on ESP8266

LiquidCrystal_I2C lcd(0x27, 16, 2);  // Common I2C address for 16x2 LCD

String receivedData = "";

void setup() {
  Serial.begin(9600);
  Wire.begin(D2, D1);  // SDA = D2 (GPIO4), SCL = D1 (GPIO5)

  lcd.init();
  lcd.backlight();

  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  lcd.setCursor(0, 0);
  lcd.print("System starts!");
  delay(2000);  // Show for 2 seconds

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Monitoring...");

}

void loop() {
  if (Serial.available()) {
    receivedData = Serial.readStringUntil('\n');
    receivedData.trim();

    if (receivedData.length() > 0) {
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("INTRUSION!");
      lcd.setCursor(0, 1);
      lcd.print(receivedData);

      digitalWrite(BUZZER_PIN, HIGH);
      delay(3000); // Buzzer ON for 3 seconds
      digitalWrite(BUZZER_PIN, LOW);
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Monitoring...");
    }
  }
}