import bcrypt
from datetime import datetime, timedelta
from jose import jwt

# Configuration
SECRET_KEY = "therapy_secret_key_2025" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 600

def hash_password(password: str) -> str:
    # Truncate to 72 chars (bcrypt limit) and convert to bytes
    pwd_bytes = password.encode('utf-8')[:72]
    # Generate salt and hash
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8')[:72], 
            hashed_password.encode('utf-8')
        )
    except Exception:
        return False

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)