🌱 MindfulAIMindfulAI is a private, AI-powered mental health sanctuary designed for reflection and Cognitive Behavioral Therapy (CBT) support.Built with a privacy-first philosophy, MindfulAI runs entirely on your local machine. Your personal thoughts and reflections never leave your hardware, thanks to the integration of a local Large Language Model (LLM).✨ Core FeaturesPrivacy-First AI: Powered by Ollama (Phi3:mini). No cloud APIs, no data tracking, and 100% offline capability.Modern Glassmorphism UI: A calming, frosted-glass interface built with React and Framer Motion for a premium user experience.Secure Authentication: Custom user authentication using bcrypt for secure password hashing and JWT for session management.Session-Based History: Persistent chat sessions stored in a local SQLite database, allowing you to track your mental growth over time.Calm UX: Includes smooth transitions, typewriter effects, and a minimalist design to reduce cognitive load.🛠️ Tech StackLayerTechnologyFrontendReact.js, Framer Motion, CSS3 (Glassmorphism)BackendFastAPI (Python 3.14), SQLAlchemyDatabaseSQLiteAI EngineOllama (Running Phi3:mini locally)🚀 Installation & Setup1. PrerequisitesOllama installed and running.Python 3.10+ installed.Node.js & npm installed.2. AI Model SetupOpen your terminal and pull the lightweight Phi3 model:Bashollama run phi3:mini
3. Backend SetupNavigate to the backend directory and start the FastAPI server:PowerShellcd backend
python -m venv venv
.\venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy bcrypt python-jose[cryptography] requests
uvicorn main:app --reload
4. Frontend SetupNavigate to the frontend directory and launch the React app:PowerShellcd frontend
npm install
npm start
🛡️ Security & PrivacyZero Cloud Footprint: By using a local instance of Ollama, your sensitive chat data remains on your device.Password Security: Industry-standard bcrypt hashing ensures user credentials are never stored in plain text.JWT Protection: Secure, token-based sessions ensure only authorized users can access their history.📂 Project StructurePlaintextMindful-Ai/
├── backend/            # FastAPI, Database & Auth logic
│   ├── main.py         # API Endpoints
│   ├── models.py       # Database Schema
│   └── database.py     # SQL Connection logic
├── frontend/           # React App
│   ├── src/            # Components (Chat, Landing, Auth)
│   └── public/         # Assets
└── README.md           # Documentation
How to update your GitHub now:Run these commands in your VS Code terminal:PowerShellgit add README.md
git commit -m "Docs: Update professional README"
git push origin main