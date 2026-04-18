from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np
import json
from app.services.model_loader import model_service as ml_engine
from app.models.prediction import PredictionLog
from sqlmodel import Session, select
from app.core.config import engine

router = APIRouter()

class TransactionRequest(BaseModel):
    features: List[float]

@router.post("/predict")
async def predict_fraud(request: TransactionRequest):
    try:
        # 1. Run Inference
        scaled_data, outputs = ml_engine.predict(request.features)
        
        # 2. Extract Label and Score
        label = int(np.array(outputs[0]).flatten()[0])
        is_fraud = (label == -1)
        
        # Extract raw score (usually the second output)
        raw_score = float(np.array(outputs[1]).flatten()[0]) if len(outputs) > 1 else float(label)

        # 3. Calculate Feature Importance (The Missing Part)
        # Your features in order: ['V2','V4','V7','V11','V12','V14','V16','V17','V18','V19','Hour']
        feature_names = ['V2', 'V4', 'V7', 'V11', 'V12', 'V14', 'V16', 'V17', 'V18', 'V19', 'Hour']
        
        # Calculate importance based on absolute distance from the mean
        importance = [
            {"name": n, "value": float(abs(v))}
            for n, v in zip(feature_names, scaled_data.flatten())
        ]

        # 4. Return the result
        return {
            "is_fraud": is_fraud,
            "reconstruction_error": raw_score, 
            "feature_importance": importance,
            "threshold": 0.0,
        }

    except Exception as e:
        # This helps you see the actual error in the VS Code terminal
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
