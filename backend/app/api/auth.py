from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from app.core.config import engine
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User

router = APIRouter()

# 1. Registration Endpoint
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(username: str, password: str):
    with Session(engine) as session:
        # Check if user already exists
        statement = select(User).where(User.username == username)
        existing_user = session.exec(statement).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already registered")
        
        # Hash password and save
        new_user = User(username=username, hashed_password=hash_password(password))
        session.add(new_user)
        session.commit()
        return {"message": "User created successfully"}

# 2. Login Endpoint (Token Exchange)
@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    with Session(engine) as session:
        # Find user
        statement = select(User).where(User.username == form_data.username)
        user = session.exec(statement).first()
        
        # Verify credentials
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Generate JWT
        access_token = create_access_token(data={"sub": user.username})
        return {"access_token": access_token, "token_type": "bearer"}