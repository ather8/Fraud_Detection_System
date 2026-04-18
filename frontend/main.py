from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

# Import our modular components
from app.core.config import engine
from app.api import auth, predict
from app.services.model_loader import model_service

# 1. Initialize the FastAPI App
app = FastAPI(
    title="FraudWatch AI API",
    description="Real-time Fraud Detection using Autoencoders and ONNX",
    version="1.0.0"
)

# 2. Configure CORS (Cross-Origin Resource Sharing)
# This allows your Vite frontend (port 5173 or 80) to talk to the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Create Database Tables on Startup
@app.on_event("startup")
def on_startup():
    # This automatically creates the User and PredictionLog tables in Postgres
    SQLModel.metadata.create_all(engine)
    print("🚀 Database tables initialized.")
    
    # Trigger model loading to ensure ONNX is ready before first request
    _ = model_service
    print("🧠 ML Model and Scaler loaded.")

# 4. Include the API Routers
# We give them 'tags' to keep the Swagger documentation organized
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(predict.router, prefix="/api", tags=["Machine Learning"])

@app.get("/")
async def root():
    return {
        "message": "FraudWatch AI API is operational",
        "docs": "/docs"
    }
