import os
from sqlmodel import create_engine

import os
from sqlmodel import create_engine

# # Use SQLite for local development without a database server
# DATABASE_URL = "sqlite:///./fraud_db.db"

# # connect_args={"check_same_thread": False} is required for SQLite + FastAPI
# engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
# This URL matches the 'db' service in your docker-compose.yml
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@localhost:5432/fraud_db"
)

engine = create_engine(DATABASE_URL, echo=False)