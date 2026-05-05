import time
import random
import os
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase (Assuming service account key is available or using default)
# For the demo, we'll try to find the service account JSON or use project ID
try:
    if not firebase_admin._apps:
        # Check if serviceAccountKey.json exists, otherwise use local credentials
        cred_path = "serviceAccountKey.json"
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            # Fallback to default credentials (works if logged in via CLI)
            firebase_admin.initialize_app()
    db = firestore.client()
except Exception as e:
    print(f"Firebase Initialization Warning: {e}")
    db = None

class SensorSimulator:
    def __init__(self, user_id):
        self.user_id = user_id
        self.base_hr = 72
        self.base_spo2 = 98
        self.base_temp = 98.6

    def generate_reading(self):
        # Simulate slight fluctuations
        hr = self.base_hr + random.randint(-2, 2)
        spo2 = max(90, min(100, self.base_spo2 + random.randint(-1, 0)))
        temp = self.base_temp + round(random.uniform(-0.2, 0.2), 1)
        
        # Occasional "anomaly" simulation
        if random.random() < 0.05:
            hr += random.randint(20, 40) # Spike
        
        return {
            "userId": self.user_id,
            "hr": hr,
            "spo2": spo2,
            "temp": temp,
            "timestamp": datetime.utcnow().isoformat(),
            "type": "automatic"
        }

    def run(self):
        print(f"Starting Sensor Simulator for User: {self.user_id}")
        while True:
            reading = self.generate_reading()
            print(f"Reading: {reading}")
            
            if db:
                try:
                    db.collection("vitals").add(reading)
                    print("Reading synced to Firestore.")
                except Exception as e:
                    print(f"Firestore Sync Error: {e}")
            
            time.sleep(5) # Push data every 5 seconds

if __name__ == "__main__":
    # In a real demo, you'd get this from the logged-in user context
    TEST_USER_ID = os.getenv("TEST_USER_ID", "demo_user_123")
    simulator = SensorSimulator(TEST_USER_ID)
    simulator.run()
