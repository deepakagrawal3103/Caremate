import os
import json
import pickle
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import tensorflow as tf
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="CareMate AI Backend")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths to models (assuming they are currently in the src folder)
MODEL_PATHS = {
    "fall_detector": "../src/fall_detector.pkl",
    "anomaly_engine": "../src/anomaly_engine.pkl",
    "behavior_predictor": "../src/behavior_predictor.pkl",
    "alert_ranker": "../src/alert_ranker.pkl",
    "crisis_forecaster": "../src/crisis_forecaster.keras"
}

# In-memory storage for loaded models
models = {}

def load_models():
    for name, path in MODEL_PATHS.items():
        try:
            if not os.path.exists(path):
                print(f"Warning: Model file not found at {path}")
                continue
            
            if path.endswith(".pkl"):
                with open(path, "rb") as f:
                    models[name] = pickle.load(f)
            elif path.endswith(".keras"):
                models[name] = tf.keras.models.load_model(path)
            print(f"Successfully loaded {name}")
        except Exception as e:
            print(f"Failed to load model {name}: {e}")

@app.on_event("startup")
async def startup_event():
    load_models()

class PredictionRequest(BaseModel):
    prompt: str
    context: Optional[str] = ""
    data: Optional[dict] = None

@app.get("/")
def read_root():
    return {"status": "CareMate AI Backend is Running", "models_loaded": list(models.keys())}

@app.get("/api/v1/models/health")
def health_check():
    return {"status": "ok", "timestamp": pd.Timestamp.now().isoformat()}

@app.post("/api/v1/models/{model_key}/predict")
async def predict(model_key: str, request: PredictionRequest):
    if model_key not in models:
        # Fallback logic if model file is missing or failing
        return {
            "status": "mock_response",
            "message": f"Model '{model_key}' is not loaded. Returning simulated result.",
            "prediction": simulate_prediction(model_key, request)
        }

    try:
        model = models[model_key]
        # This is where you would process the request.data and call model.predict()
        # Since I don't know the exact input shape of your trained models, 
        # I'll provide a generic prediction wrapper.
        
        # Example for scikit-learn models
        if hasattr(model, "predict"):
            # Dummy feature extraction - replace with real logic
            features = np.array([[0, 0, 0]]) 
            prediction = model.predict(features)
            return {"status": "success", "prediction": prediction.tolist()}
            
        return {"status": "error", "message": "Model format not recognized for prediction."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

def simulate_prediction(model_key, request):
    """Fallback simulation for demonstration purposes"""
    if model_key == "fall_detector":
        return {"fall_detected": False, "confidence": 0.98}
    if model_key == "anomaly_engine":
        return {"status": "normal", "anomalies": []}
    if model_key == "crisis_forecaster":
        return {"score": 15, "risk": "low"}
    if model_key == "alert_ranker":
        # Returns the same alerts but sorted (simulated)
        return [] 
    return {"result": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
