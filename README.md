# 🌱 MindfulAI

**MindfulAI** is a private, AI-powered sanctuary for mental reflection and CBT (Cognitive Behavioral Therapy). Unlike traditional AI tools, MindfulAI is built with a **privacy-first** philosophy, using a local LLM to ensure your personal thoughts never leave your hardware.



---

## ✨ Key Features

* **Glassmorphism UI**: A calming, modern interface designed with React and Framer Motion for a smooth, high-end user experience.
* **Local LLM Integration**: Powered by **Ollama (Phi3:mini)** to provide intelligent, empathetic responses without cloud data processing.
* **Secure Authentication**: Custom-built auth system using `bcrypt` for secure password hashing and JWT for session management.
* **Session-Based History**: Organized chat sessions that allow you to revisit past reflections, stored in a local SQLite database.
* **Animated Interactions**: Fluid transitions and a "Typewriter" effect that makes the AI feel responsive and human.

---

## 🛠️ Tech Stack

### Frontend
- **React.js**: Functional components and hooks.
- **Framer Motion**: Smooth entry/exit animations.
- **CSS3**: Custom glassmorphism styles and responsive layout.

### Backend
- **FastAPI**: High-performance Python framework.
- **SQLAlchemy**: ORM for local database management.
- **Bcrypt & JWT**: Secure user authentication and authorization.

### AI Engine
- **Ollama**: Running the **Phi3:mini** model locally.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js & npm
- [Ollama](https://ollama.com/)

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend