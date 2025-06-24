from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from app.core.security import SECRET_KEY, ALGORITHM
from app.domains.auth.repository import fake_users_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def register_user(email: str, password: str):
    if email in fake_users_db:
        raise ValueError("Usuário já existe.")
    hashed = pwd_context.hash(password)
    fake_users_db[email] = {"email": email, "hashed_password": hashed}
    return True

def authenticate_user(email: str, password: str):
    user = fake_users_db.get(email)
    if not user or not pwd_context.verify(password, user["hashed_password"]):
        return None
    return user

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=30)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
