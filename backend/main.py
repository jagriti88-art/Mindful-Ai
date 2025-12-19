
# from fastapi import FastAPI, Depends
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from sqlalchemy import Column, Integer, String, Text, DateTime, create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base, Session
# from datetime import datetime
# import ollama

# app = FastAPI()

# # Allow React frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Database setup
# DATABASE_URL = "sqlite:///./chat.db"
# engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base = declarative_base()

# # ChatMessage table
# class ChatMessage(Base):
#     __tablename__ = "chat_messages"
#     id = Column(Integer, primary_key=True, index=True)
#     user_name = Column(String, default="Guest")
#     conversation_id = Column(Integer, default=0)  # NEW
#     role = Column(String)  # "user" or "assistant"
#     content = Column(Text)
#     timestamp = Column(DateTime, default=datetime.utcnow)

# Base.metadata.create_all(bind=engine)

# # Dependency
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# # Request model
# class ChatRequest(BaseModel):
#     messages: list
#     user_name: str = "Guest"
#     conversation_id: int = 0  # NEW

# # 🔒 Therapist prompt
# SYSTEM_PROMPT = """You are a calm and empathetic Cognitive Behavioral Therapy (CBT) assistant.
# - Your tone is gentle and friendly.
# - Keep your tone human-like and avoid sounding robotic.
# - Keep your english simple.
# - Give motivational encouragements and talk like a friend.
# - Validate the user's feelings first.
# - Ask short, insightful questions to help the user identify 'Cognitive Distortions'.
# - Do not give long generic advice. Keep responses under 4 sentences.
# - NEVER mention 'profile pictures', 'mentors', or 'social media'."""

# # Chat endpoint
# @app.post("/chat")
# def chat(req: ChatRequest, db: Session = Depends(get_db)):
#     # Call AI
#     response = ollama.chat(
#         model="phi3:mini",
#         messages=[{"role": "system", "content": SYSTEM_PROMPT}] + req.messages,
#         options={"temperature": 0.3, "num_ctx": 2048},
#     )
#     reply = response["message"]["content"]

#     # Save user messages
#     for msg in req.messages:
#         db_msg = ChatMessage(
#             user_name=req.user_name,
#             conversation_id=req.conversation_id,
#             role=msg["role"],
#             content=msg["content"]
#         )
#         db.add(db_msg)

#     # Save AI reply
#     db.add(ChatMessage(
#         user_name=req.user_name,
#         conversation_id=req.conversation_id,
#         role="assistant",
#         content=reply
#     ))
#     db.commit()

#     return {"reply": reply}

# # History endpoint per conversation
# @app.get("/history/{user_name}/{conversation_id}")
# def history(user_name: str, conversation_id: int, db: Session = Depends(get_db)):
#     chats = (
#         db.query(ChatMessage)
#         .filter(
#             ChatMessage.user_name == user_name,
#             ChatMessage.conversation_id == conversation_id
#         )
#         .order_by(ChatMessage.timestamp)
#         .all()
#     )
#     return [{"role": c.role, "content": c.content} for c in chats]

# # Create new conversation
# @app.post("/new_conversation/{user_name}")
# def new_conversation(user_name: str, db: Session = Depends(get_db)):
#     last_conv = db.query(ChatMessage.conversation_id)\
#                   .filter(ChatMessage.user_name == user_name)\
#                   .order_by(ChatMessage.conversation_id.desc()).first()
#     new_id = (last_conv[0] + 1) if last_conv else 1
#     return {"conversation_id": new_id}
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import ollama

# Import from your other files
import models
import auth
import database

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database tables
models.Base.metadata.create_all(bind=database.engine)

# --- Pydantic Models for Validation ---
class UserAuth(BaseModel):
    username: str
    password: str

class ChatRequest(BaseModel):
    messages: list
    user_id: int
    conversation_id: int

# 🔒 UNCHANGED THERAPIST PROMPT
SYSTEM_PROMPT = """You are a calm and empathetic Cognitive Behavioral Therapy (CBT) assistant.
- Your tone is gentle and friendly.
- Keep your tone human-like and avoid sounding robotic.
- Keep your english simple.
- Give motivational encouragements and talk like a friend.
- Validate the user's feelings first.
- Ask short, insightful questions to help the user identify 'Cognitive Distortions'.
- Do not give long generic advice. Keep responses under 4 sentences.
- NEVER mention 'profile pictures', 'mentors', or 'social media'."""

# --- Auth Routes ---

@app.post("/register")
def register(user: UserAuth, db: Session = Depends(database.get_db)):
    existing_user = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    new_user = models.User(
        username=user.username,
        password=auth.hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/token")
def login(user: UserAuth, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    access_token = auth.create_access_token(data={"sub": db_user.username})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user_id": db_user.id,
        "username": db_user.username
    }

# --- Session & Chat Routes ---

@app.post("/new_conversation/{user_id}")
def create_new_conversation(user_id: int, db: Session = Depends(database.get_db)):
    new_convo = models.Conversation(user_id=user_id, title="New Chat")
    db.add(new_convo)
    db.commit()
    db.refresh(new_convo)
    return {"conversation_id": new_convo.id}

@app.get("/sessions/{user_id}")
def get_user_sessions(user_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Conversation).filter(models.Conversation.user_id == user_id).all()

@app.get("/history/{conversation_id}")
def get_chat_history(conversation_id: int, db: Session = Depends(database.get_db)):
    history = db.query(models.ChatMessage).filter(
        models.ChatMessage.conversation_id == conversation_id
    ).order_by(models.ChatMessage.timestamp).all()
    return [{"role": m.role, "content": m.content} for m in history]

@app.post("/chat")
def chat(req: ChatRequest, db: Session = Depends(database.get_db)):
    # 1. Generate AI Response (Using your exact parameters)
    response = ollama.chat(
        model="phi3:mini",
        messages=[{"role": "system", "content": SYSTEM_PROMPT}] + req.messages,
        options={"temperature": 0.3, "num_ctx": 2048},
    )
    reply = response["message"]["content"]

    # 2. Save User Message to DB
    user_msg = models.ChatMessage(
        conversation_id=req.conversation_id,
        role="user",
        content=req.messages[-1]["content"]
    )
    db.add(user_msg)

    # 3. Save AI Reply to DB
    ai_msg = models.ChatMessage(
        conversation_id=req.conversation_id,
        role="assistant",
        content=reply
    )
    db.add(ai_msg)
    
    db.commit()

    return {"reply": reply}
