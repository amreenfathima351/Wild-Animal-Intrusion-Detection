import cv2
import time
import csv
from datetime import datetime
import db  # Import DB connection & cursor
from config import model, village_authority, forest_official, arduino, CSV_FILE, LD_TWILIO_FROM_NO, LD_TWILIO_TO_NO, MD_TWILIO_FROM_NO, MD_TWILIO_TO_NO

alert_animals = {"elephant", "bear", "horse", "giraffe", "zebra", "sheep"}
less_dangerous_animals = {"horse", "zebra", "sheep"}
most_dangerous_animals = {"elephant", "bear", "giraffe"}

def is_most_dangerous(detected_set: set):
    return any(animal in detected_set for animal in most_dangerous_animals)

def is_less_dangerous(detected_set: set):
    return any(animal in detected_set for animal in less_dangerous_animals)

last_alert_time = 0
alert_cooldown = 3 # seconds

alerts_list = []

def add_alert_message(msg, danger_level):
    global alerts_list
    alerts_list.append({"msg": msg, "danger_level": danger_level})
    if len(alerts_list) > 10:
        alerts_list.pop(0)

def log_alert(animals, category, status):
    timestamp = datetime.now().strftime("%d-%b-%Y %I:%M:%S %p")
    with open(CSV_FILE, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)  # Use default comma delimiter
        writer.writerow([
            timestamp,
            ', '.join(animal.title() for animal in animals),  # Properly formatted list
            category,
            status
        ])

def insert_detection_to_db(animals):
    if not db.cursor:
        print("❌ DB cursor not available. Check DB connection.")
        return

    try:
        if not animals:
            return  # Skip empty

        animal_str = ', '.join(animal.title() for animal in animals)
        query = "INSERT INTO detection_data (animals) VALUES (%s)"  # ❌ removed detection_time
        db.cursor.execute(query, (animal_str,))
        db.conn.commit()
        print("✅ Inserted into DB:", animal_str)

    except Exception as e:
        db.conn.rollback()
        print("❌ Failed to insert into DB:", e)


def generate_frames():
    global last_alert_time
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = model.predict(frame, conf=0.3)
        annotated_frame = results[0].plot()

        labels = results[0].names
        detections = results[0].boxes.cls.cpu().numpy().astype(int)
        detected_animals = {labels[i].lower() for i in detections}

        # Filter detected animals to include only dangerous ones
        relevant_animals = detected_animals & (most_dangerous_animals | less_dangerous_animals)
        detection_msg = f"{', '.join(relevant_animals).title()}" if relevant_animals else "No harmful Intrusion"
        danger_level = (
            "most_dangerous" if is_most_dangerous(detected_animals)
            else "less_dangerous" if is_less_dangerous(detected_animals)
            else "none"
        )
        add_alert_message(detection_msg, danger_level)

        match = detected_animals & alert_animals
        if match and (time.time() - last_alert_time > alert_cooldown):
            try:
                alert_system = forest_official if is_most_dangerous(match) else village_authority
                # 1. Send WhatsApp message
                
                if (is_most_dangerous(match) and is_less_dangerous(match)):
                    alert_system = forest_official
                    message = alert_system.messages.create(
                    body = f"Alerting Forest Official!\n⚠ Detected {', '.join(match & most_dangerous_animals).title()} in Sector A\n{datetime.now().strftime('%d-%b-%Y %I:%M:%S %p')}",
                    from_= MD_TWILIO_FROM_NO,
                    to= MD_TWILIO_TO_NO)
                    print("Twilio alert sent to forest officer:", message.sid)

                    alert_system = village_authority
                    message = alert_system.messages.create(
                    body = f"Alerting Village Authority!\n⚠ Detected {', '.join(match & less_dangerous_animals).title()} in Sector A\n{datetime.now().strftime('%d-%b-%Y %I:%M:%S %p')}",
                    from_= LD_TWILIO_FROM_NO,
                    to= LD_TWILIO_TO_NO)
                    print("Twilio alert sent to village authority:", message.sid)

                else:
                    message = alert_system.messages.create(
                    body = f"Alerting {'Forest Official' if is_most_dangerous(match) else 'Village Authority'}!\n⚠ Detected {', '.join(match).title()} in Sector A\n{datetime.now().strftime('%d-%b-%Y %I:%M:%S %p')}",
                    from_= MD_TWILIO_FROM_NO if is_most_dangerous(match) else LD_TWILIO_FROM_NO,
                    to= MD_TWILIO_TO_NO if is_most_dangerous(match) else LD_TWILIO_TO_NO)
                    print("Twilio alert sent:", message.sid)

                # 2. Send data to ESP8266
                if arduino:
                    try:
                        arduino.write((', '.join(match).title() + '\n').encode())
                        print("Sent to ESP8266:", ', '.join(match).title())
                    except Exception as se:
                        print("Failed to send to ESP8266:", se)

                if (is_most_dangerous(match) and is_less_dangerous(match)):
                    log_alert(match & most_dangerous_animals, "Most Dangerous", "Alert sent")
                    log_alert(match & less_dangerous_animals, "Less Dangerous", "Alert sent")
                else:
                    log_alert(match,"Most Dangerous" if is_most_dangerous(match) else "Less Dangerous" ,"Alert sent")
                last_alert_time = time.time()

            except Exception as e:
                print("Twilio send error:", e)
                log_alert(match,"Most Dangerous" if is_most_dangerous(match) else "Less Dangerous" , f"Failed: {str(e)}")
            insert_detection_to_db(match)

        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'   
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    cap.release()

def get_alerts():
    return alerts_list