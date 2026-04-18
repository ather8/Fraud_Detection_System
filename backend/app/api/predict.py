from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
import numpy as np
import json
from app.services.model_loader import model_service
from app.models.prediction import PredictionLog
from sqlmodel import Session
from app.core.config import engine

router = APIRouter()

class TransactionRequest(BaseModel):
    features: List[float]

class PredictionResponse(BaseModel):
    is_fraud: bool
    anomaly_score: float
    feature_importance: List[dict]
    threshold: float

@router.post("/predict", response_model=PredictionResponse)
async def predict_fraud(request: TransactionRequest):
    try:
        # 1. Get results from model
        # Typically returns: [labels_array, scores_array]
        result = model_service.predict(request.features)
        
        # Safe unpacking: labels are result[0], scores are result[1]
        labels = result[0] 
        scores = result[1]
        
        # 2. Isolation Forest Logic:
        # Label -1 = Anomaly (Fraud), 1 = Normal
        is_fraud = bool(labels[0] == -1)
        
        # Anomaly Score: 
        # In sklearn, lower/more negative = more anomalous. 
        # In ONNX/AutoML, it's often a probability or distance.
        score = float(scores[0]) 

        # 3. Feature Importance for Isolation Trees
        # Since Trees don't have "errors", we use the distance from mean or 
        # contribution to the path length. A simple proxy is the absolute 
        # scaled value of the feature.
        feature_names = ['V2', 'V4', 'V7', 'V11', 'V12', 'V14', 'V16', 'V17', 'V18', 'V19', 'Hour']
        
        # Using scaled_data for explainability (assuming model_service provides it)
        # If model_service only returns (labels, scores), you may need to 
        # adjust your service to also return the scaled_input.
        scaled_input = request.features # Replace with actual scaled data if available
        
        importance = [
            {"name": n, "value": float(abs(v))}
            for n, v in zip(feature_names, scaled_input)
        ]

        return {
            "is_fraud": is_fraud,
            "anomaly_score": score, # Rename to 'anomaly_score' in your Pydantic model
            "feature_importance": importance,
            "threshold": THRESHOLD
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference Error: {str(e)}")



@router.get("/history")
async def get_history():
    with Session(engine) as session:
        from sqlmodel import select
        statement = select(PredictionLog).order_by(PredictionLog.timestamp.desc()).limit(10)
        return session.exec(statement).all()
