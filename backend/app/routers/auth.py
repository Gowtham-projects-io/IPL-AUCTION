from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import User
from backend.app.schemas import UserCreate, UserLogin, UserOut, Token
from backend.app.services.auth_service import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        (User.username == user_in.username) | (User.email == user_in.email)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered."
        )

    new_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        is_admin=False,
        avatar_url=f"https://api.dicebear.com/7.x/bottts/svg?seed={user_in.username}"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.username, "user_id": new_user.id, "is_admin": new_user.is_admin})
    return Token(access_token=token, user=UserOut.model_validate(new_user))

@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login_in.username).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password."
        )

    token = create_access_token({"sub": user.username, "user_id": user.id, "is_admin": user.is_admin})
    return Token(access_token=token, user=UserOut.model_validate(user))

@router.post("/guest-login", response_model=Token)
def guest_login(db: Session = Depends(get_db)):
    demo_user = db.query(User).filter(User.username == "cricket_fan").first()
    if not demo_user:
        demo_user = User(
            username="cricket_fan",
            email="fan@iplauctionarena2027.com",
            hashed_password=hash_password("fan123"),
            is_admin=False,
            avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=CricketFan"
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

    token = create_access_token({"sub": demo_user.username, "user_id": demo_user.id, "is_admin": demo_user.is_admin})
    return Token(access_token=token, user=UserOut.model_validate(demo_user))

