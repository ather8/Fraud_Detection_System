from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
import numpy as np
from app.services.model_loader import model_service

from app.models.prediction import PredictionLog
from sqlmodel import Session, select
from app.core.config import engine

# Define the API Route group
router = APIRouter()

# 1. Define the Input Data Schema
class TransactionRequest(BaseModel):
    # This expects a list of numbers (V2, V4, V11, Hour, etc.)
    features: List[float]

# 2. Define the Output Data Schema
class PredictionResponse(BaseModel):
    is_fraud: bool
    reconstruction_error: float
    feature_importance: List[dict]
    threshold: float

# The Detection Logic
THRESHOLD = 0.05  # Set this to the 90th percentile from your notebook

@router.post("/predict", response_model=PredictionResponse)
async def predict_fraud(request: TransactionRequest):
    try:
        # A. Run Inference through our Model Service
        scaled_data, reconstructed = model_service.predict(request.features)

        # B. Calculate Reconstruction Error (MSE)
        # We compare how well the model "re-drew" the input
        errors = np.power(scaled_data - reconstructed, 2)
        mse = np.mean(errors)

        # C. Determine Fraud Status
        is_fraud = bool(mse > THRESHOLD)

        # D. Calculate Feature Importance (Explainability)
        # Which feature contributed most to the error?
        feature_names = ['V2', 'V4', 'V7', 'V11', 'V12', 'V14', 'V16', 'V17', 'V18', 'V19', 'Hour']
        importance = [
            {"name": name, "value": float(err)} 
            for name, err in zip(feature_names, errors[0])
        ]

        return {
            "is_fraud": is_fraud,
            "reconstruction_error": float(mse),
            "feature_importance": importance,
            "threshold": THRESHOLD
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction Error: {str(e)}")

@router.get("/history")
async def get_history():
    with Session(engine) as session:
        statement = select(PredictionLog).order_by(PredictionLog.timestamp.desc()).limit(10)
        return session.exec(statement).all()
