#  Healthcare Doctor–Patient Translation Web Application

A full-stack web application that enables real-time multilingual communication between doctors and patients using AI-powered translation, audio recording, conversation logging, search, and summarization.

---

##  Live Demo

Frontend: https://<your-frontend-link>  
Backend API: https://<your-backend-link>

---

##  Project Overview

This project was built as part of a timed take-home assignment to demonstrate:

- Full-stack system design
- AI/LLM integration
- Audio handling
- Conversation persistence
- Search and summarization
- Deployment readiness

The application supports two roles — **Doctor** and **Patient** — allowing communication via text or audio while automatically translating messages into the selected target language.

---

##  Features Implemented

- Real-time text translation
- Doctor & Patient roles
- Audio recording from browser
- Audio playback inside chat
- Conversation persistence
- Keyword search with highlighting
- AI-powered conversation summarization
- Mobile-friendly UI
- Deployed backend & frontend

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- CSS
- Axios

### Backend
- Django
- Django REST Framework
- SQLite (local) / PostgreSQL (prod)

### AI / LLM
- OpenAI API (translation & summary)

---

##  AI Tools & Resources Used

- OpenAI API
- ChatGPT for debugging & UI improvements
- Documentation & open-source references

---

##  Known Limitations / Trade-offs

- Real-time streaming translation not implemented (request-based)
- Audio transcription basic
- Authentication not added due to time constraints
- Limited language set
- Simple UI focus vs enterprise polish

---

##  Running Locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


### frontend

cd frontend
npm install
npm run dev


---

##  Deployment

Frontend deployed on Vercel.  
Backend deployed on Render.

(Links will be updated after deployment.)

---

##  Submission

- GitHub Repository: <your-github-repo-link>
- Live Application: <your-live-app-link>

---

##  Author

Srinikethan Edelli
