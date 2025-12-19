# 🌱 MindfulAI

**MindfulAI** is a private, AI-powered mental health sanctuary designed for reflection and Cognitive Behavioral Therapy (CBT) support. Built with a **privacy-first** philosophy, MindfulAI runs entirely on your local machine. Your personal thoughts and reflections never leave your hardware, thanks to the integration of a local Large Language Model (LLM).

---

## ✨ Core Features

* **Privacy-First AI**
  Powered by **Ollama (Phi3:mini)**. No cloud APIs, no data tracking, and 100% offline capability.

* **Modern Glassmorphism UI**
  A calming, frosted-glass interface built with **React** and **Framer Motion** for a premium user experience.

* **Secure Authentication**
  Custom user authentication using **bcrypt** for secure password hashing and **JWT** for session management.

* **Session-Based History**
  Persistent chat sessions stored in a local **SQLite** database, allowing you to track your mental growth over time.

* **Calm UX**
  Smooth transitions, typewriter effects, and a minimalist design to reduce cognitive load.

---

## 🛠️ Tech Stack

| Layer         | Technology                                    |
| ------------- | --------------------------------------------- |
| **Frontend**  | React.js, Framer Motion, CSS3 (Glassmorphism) |
| **Backend**   | FastAPI (Python 3.14), SQLAlchemy             |
| **Database**  | SQLite                                        |
| **AI Engine** | Ollama (Phi3:mini – Local LLM)                |

---

## 🚀 Installation & Setup

### 1️⃣ Prerequisites

Make sure you have the following installed:

* [Ollama](https://ollama.com/) (running locally)
* Python **3.10+**
* Node.js & npm

---

### 2️⃣ AI Model Setup

Pull and run the lightweight Phi-3 model:

```bash
ollama run phi3:mini
```

---

### 3️⃣ Backend Setup (FastAPI)

Open **PowerShell / Terminal** and run:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy bcrypt python-jose[cryptography] requests
uvicorn main:app --reload
```

Backend will be available at:

```
http://127.0.0.1:8000
```

---

### 4️⃣ Frontend Setup (React)

In a new terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

(or another port depending on setup)

---

## 🛡️ Security & Privacy

* **Zero Cloud Footprint**
  All AI inference runs locally using Ollama. No user data is sent to external servers.

* **Password Security**
  Industry-standard **bcrypt** hashing ensures credentials are never stored in plain text.

* **JWT Protection**
  Secure, token-based authentication protects user sessions and chat history.

---

## 📂 Project Structure

```plaintext
Mindful-Ai/
├── backend/            # FastAPI, database & authentication logic
│   ├── main.py         # API endpoints
│   ├── models.py       # Database models
│   └── database.py     # Database connection
│
├── frontend/           # React application
│   ├── src/            # Components (Chat, Landing, Auth)
│   └── public/         # Static assets
│
└── README.md           # Project documentation
```

---

## 🌟 Future Improvements

* Emotion analytics & mood tracking
* Encrypted local backups
* Multi-model AI support
* Therapist-style CBT flows

---

## ⚠️ Disclaimer

MindfulAI is **not a replacement for professional mental health care**. It is intended as a supportive, reflective tool only.

---

## 🤍 Author

Built with care for privacy, mental wellness, and thoughtful design.
