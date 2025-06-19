from flask import Flask, Response, send_file, jsonify
from flask_cors import CORS
from utils import generate_frames, get_alerts
from config import CSV_FILE
from db import conn, cursor

app = Flask(__name__)
CORS(app)

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/download_alerts')
def download_alerts():
    return send_file(CSV_FILE, as_attachment=True)

@app.route('/get_alerts')
def get_alerts_route():
    return jsonify(get_alerts())

@app.route('/get_animal_counts')
def get_animal_counts():
    try:
        cursor.execute("""
            SELECT date, animals
            FROM detection_data
            ORDER BY date DESC
        """)
        rows = cursor.fetchall()
        # Split comma-separated animals and create flat list
        data = []
        for row in rows:
            date_str = row[0].strftime("%Y-%m-%d")
            animals = [animal.strip().title() for animal in row[1].split(',') if animal.strip()]
            for animal in animals:
                data.append({"date": date_str, "animal": animal})
        return jsonify(data)
    except Exception as e:
        print(f"Error fetching animal counts: {e}")
        return jsonify({"error": "Failed to fetch animal counts"}), 500

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)