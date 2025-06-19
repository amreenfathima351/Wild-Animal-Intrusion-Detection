from dotenv import load_dotenv
from ultralytics import YOLO
from twilio.rest import Client
import os,csv
import serial

load_dotenv()

# Load YOLOv8 model
model = YOLO(os.getenv("YOLO_MODEL"))

# Twilio credentials
LD_TWILIO_AC_SID = os.getenv("LD_TWILIO_AC_SID")
LD_TWILIO_AUTH_TOKEN = os.getenv("LD_TWILIO_AUTH_TOKEN")
LD_TWILIO_FROM_NO = os.getenv("LD_TWILIO_FROM_NO")
LD_TWILIO_TO_NO = os.getenv("LD_TWILIO_TO_NO")

MD_TWILIO_AC_SID = os.getenv("MD_TWILIO_AC_SID")
MD_TWILIO_AUTH_TOKEN = os.getenv("MD_TWILIO_AUTH_TOKEN")
MD_TWILIO_FROM_NO = os.getenv("MD_TWILIO_FROM_NO")
MD_TWILIO_TO_NO = os.getenv("MD_TWILIO_TO_NO")

# DB
HOST=os.getenv("HOST")
PORT=os.getenv("PORT")
DATABASE=os.getenv("DATABASE")
USER=os.getenv("USER")
PASSWORD=os.getenv("PASSWORD")

village_authority = Client(LD_TWILIO_AC_SID, LD_TWILIO_AUTH_TOKEN)
forest_official = Client(MD_TWILIO_AC_SID, MD_TWILIO_AUTH_TOKEN)

# Serial setup for ESP8266
try:
    arduino = serial.Serial(os.getenv("SERIAL_PORT"), os.getenv("BAUD_RATE"))
except Exception as e:
    print("Error connecting to ESP8266:", e)
    arduino = None

CSV_FILE = os.getenv("CSV_FILE")
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)  # comma is the default delimiter
        writer.writerow(['Timestamp', 'Detected Animals', 'Category', 'Twilio Status'])