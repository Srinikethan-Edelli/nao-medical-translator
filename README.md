# 🏥 Healthcare Doctor–Patient Translation Web Application

A full-stack web application that enables real-time multilingual communication between doctors and patients using AI-powered translation and summarization.

---

## 🚀 Live Demo

Frontend: <your-frontend-link>  
Backend API: <your-backend-link>

---

## 📌 Project Overview

This project was built as part of a timed technical assignment to evaluate full-stack development, AI/LLM integration, audio handling, and deployment under time constraints.

The application allows two roles — Doctor and Patient — to communicate through text or voice while the system translates messages into the selected language in near real time. Conversations are logged, searchable, and can be summarized using AI to highlight medically important points.

---

## ✨ Features Implemented

- Role-based chat (Doctor / Patient)
- AI-powered translation
- Text chat interface
- Audio recording from browser
- Audio upload and playback
- Persistent conversation history
- Conversation search
- AI-generated medical summary
- Mobile responsive UI

---

## 🛠 Tech Stack

### Frontend
- React
- JavaScript
- Vite
- CSS / Tailwind
- Web Audio API

### Backend
- Django
- Django REST Framework

### Database
- SQLite / PostgreSQL

### AI / LLM
- OpenAI API / Gemini API

### Deployment
- Vercel / Netlify (Frontend)
- Render / Railway (Backend)

---

## 🧩 Architecture

React UI → Django REST API → AI Services → Database  
                               → Audio Storage

---

## 🤖 AI Tools & Resources Used

- ChatGPT for system design, debugging, and documentation
- AI APIs for translation and summarization
- Official documentation

---

## ⚠️ Known Limitations & Trade-offs

- Real-time updates implemented using polling instead of WebSockets
- Authentication not implemented
- Audio stored using basic local or cloud storage
- Not HIPAA compliant (demo only)
- Limited error handling

---

## 🔮 Future Improvements

- WebSocket-based real-time chat
- JWT authentication
- Secure audio encryption
- Cloud object storage (AWS S3 / GCP)
- HIPAA-compliant workflows
- Analytics dashboard

---

## 🧪 Running Locally

### Backend Setup

```bash
cd backend
python -m venv env
source env/bin/activate   # Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
