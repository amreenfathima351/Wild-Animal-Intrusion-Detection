# AI POWERED WILD ANIMAL INTRUSION DETECTION SYSTEM USING COMPUTER VISION FOR REAL TIME SECURITY AND PREVENTION

A real-time system for detecting wild animals using YOLOv8, sending WhatsApp alerts via Twilio, displaying detections on a web interface, and triggering local alerts via an ESP8266 with LCD and buzzer.

## Overview

This system detects wild animals in video feeds using a YOLOv8 nano model, categorizes them as `Less Dangerous` (e.g., Horse, Sheep, Zebra) or `Most Dangerous` (e.g., Elephant, Bear, Giraffe), and sends alerts:
- **WhatsApp**: To village authorities (`Less Dangerous`) or forest officials (`Most Dangerous`).
- **Local**: Via ESP8266 with a 16x2 LCD display and buzzer.
- **Web Interface**: Displays live video feed, alerts, location, an animal-wise chart (Analysis), and a map, with a downloadable alert log.

---

## System Architecture

- **Backend** (`backend/`): Flask server with YOLOv8 inference, Twilio integration, and serial communication to ESP8266.
- **Frontend** (`frontend/`): React SPA with video feed, alerts, geolocation, Leaflet map, and log download.
- **Hardware** (`hardware/Wild_Animal/`): ESP8266 sketch for LCD display and buzzer alerts.

---

## Prerequisites

### Software
- Python 3.10+
- Node.js 16+
- Arduino IDE
- Dependencies:
  - Backend: See `backend/requirements.txt` (Flask, ultralytics, Twilio, etc.)
  - Frontend: See `frontend/package.json` (React, react-leaflet, etc.)
- Twilio account with WhatsApp-enabled numbers
- PostgreSQL + PgAdmin4

### Hardware
- ESP8266 (e.g., NodeMCU)
- 16x2 LCD with I2C module
- Buzzer
- Webcam or USB camera
- Computer with serial port (e.g., COM5)

---

## Setup and Installation

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd wild-animal-detection
    ```
2.  **Backend Setup**:
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    ```
    * Create a `.env` file in `backend/` (see `.env.example` below).
    * Place `yolov8n.pt` in `backend/` or use trained weights from `backend/runs/detect/wild_animals/weights`.
3.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    ```
4.  **Hardware Setup**:
    * Open `hardware/Wild_Animal/Wild_Animal.ino` in Arduino IDE.
    * Connect ESP8266, LCD (SDA: D2, SCL: D1), and buzzer (D6).
    * Upload the sketch to the ESP8266.

### Environment Variables (`backend/.env`):

```plaintext
YOLO_MODEL=yolov8n.pt
LD_TWILIO_AC_SID=<your-less-dangerous-twilio-account-sid>
LD_TWILIO_AUTH_TOKEN=<your-less-dangerous-twilio-auth-token>
LD_TWILIO_FROM_NO=whatsapp:<your-twilio-from-number>
LD_TWILIO_TO_NO=whatsapp:<whatsapp number ld>
MD_TWILIO_AC_SID=<your-most-dangerous-twilio-account-sid>
MD_TWILIO_AUTH_TOKEN=<your-most-dangerous-twilio-auth-token>
MD_TWILIO_FROM_NO=whatsapp:<your-twilio-from-number>
MD_TWILIO_TO_NO=whatsapp:<whatsapp number md>
SERIAL_PORT=COM5
BAUD_RATE=9600
CSV_FILE=alerts_log.csv
HOST=localhost
PORT=5432
DATABASE=finalyr_proj
USER=postgres
PASSWORD=<password>
```
### Usage
#### Start the Backend:
```
cd backend
source venv/bin/activate
python app.py
Runs Flask server on http://localhost:5000.
```
#### Start the Frontend:
```
cd frontend
npm start
Opens the web interface at http://localhost:3000.
```
#### Connect Hardware:
```
Ensure ESP8266 is connected to COM5 and running the sketch.
Connect the webcam to the computer.
Access the System:
Open http://localhost:3000 in a browser.
View live video feed, alerts, location, and map.
Download alert logs via the “Download Alert Logs” button.
ESP8266 displays detections on LCD and triggers buzzer.
```

### File Structure
```
project/
├── backend/
│   ├── alerts_log.csv           # Primary detection log
│   ├── app.py                   # Flask server
│   ├── config.py                # YOLOv8, Twilio, serial setup
│   ├── utils.py                 # Detection and alert logic
│   ├── data.yml                 # YOLOv8 dataset config
│   ├── requirements.txt         # Backend dependencies
│   ├── yolov8n.pt               # YOLOv8 model
│   ├── runs/detect/wild_animals/
│   │   ├── args.yaml            # Training config
│   ├── Datasets/                # Training/test data (66 classes)
│   └── .env                     # Environment variables
├── frontend/
│   ├── public/
│   │   └── index.html           # React entry point
│   ├── src/
│   │   ├── app.js               # Main React component
│   │   ├── index.js             # React initialization
│   │   ├── components/
│   │   │   ├── Alerts.jsx         # Displays latest alert
│   │   │   ├── Header.jsx         # Page header
│   │   │   ├── LocationDisplay.jsx # Location info
│   │   │   ├── MapDisplay.jsx     # Leaflet map
│   │   │   └── VideoFeed.jsx      # Live video feed
│   │   │   └── AnalysisModal.jsx  # Detection analysis chart
            |__ UtilButtons.jsx    # Utility action buttons
│   │   ├── package.json           # Frontend dependencies
│   │   └── node_modules/          # Node.js dependencies
├── hardware/Wild_Animal/
│   └── Wild_Animal.ino          # ESP8266 sketch
├── README.md                    # Project documentation
└── .gitignore                   # Git ignore rules
```
### 📊 Detection Analysis Modal

The AnalysisModal provides a visual summary of animals detected using a bar chart:

- Displays total detections of each animal.
- Filter options: **Overall**, **Today**, or a **Selected Date**.
- Fetches alert data from the backend (`/get_animal_counts` endpoint).
- Helps monitor which animals are most frequently detected over time.
- Opens as a modal in the UI when triggered.

> Chart is rendered using [Recharts](https://recharts.org/).

---

## Backend API Endpoints

| Endpoint             | Method | Description                                             |
|----------------------|--------|---------------------------------------------------------|
| `/video_feed`        | GET    | Streams live video feed from the webcam.                |
| `/download_alerts`   | GET    | Downloads the alert log CSV file.                        |
| `/get_alerts`        | GET    | Returns recent alert messages with timestamps and levels.|
| `/get_animal_counts` | GET    | Returns detected animal data by date for analysis charts.|

### Known Issues
```
Twilio Daily Limit: The Less Dangerous Twilio account hits a 9-message daily limit. Consider upgrading to a paid plan.
DNS Failures: Network issues caused 16 alert failures (May 21, 2025). Implement retry logic in utils.py.
Class Mismatch: Only 6 of 66 dataset classes are currently used for detection. Update data.yml for full detection capabilities.
Redundant Fetching: Alerts.jsx duplicates alert fetching from app.js. Remove the useEffect hook in Alerts.jsx to optimize.
```
### Future Improvements
```
Add retry logic for Twilio DNS failures.
Train YOLOv8 on all 66 classes available in the dataset.
Implement logging for ESP8266 serial communication errors for better debugging.
Optimize frontend alert fetching to prevent redundancy.
Add authentication to the Flask backend for enhanced security.
Deploy the backend and frontend to a cloud server for remote accessibility.
```
### Contributors
```
Archanaa M
Amreen Fathima A
Kaviyarasan S
```
