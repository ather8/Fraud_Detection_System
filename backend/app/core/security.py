import os
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from passlib.context import CryptContext

# 1. Configuration
# In production, change this to a long random string in your .env file
SECRET_KEY = os.getenv("SECRET_KEY", "7b9e918d68902517822d86f78f844b2f8a846c48") 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# 2. Password Hashing Utility
# This ensures we never store plain-text passwords in PostgreSQL
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# 3. JWT Token Generation
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
