import os
from sqlmodel import create_engine

# This URL matches the 'db' service in your docker-compose.yml
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@localhost:5432/fraud_db"
)

engine = create_engine(DATABASE_URL, echo=False)