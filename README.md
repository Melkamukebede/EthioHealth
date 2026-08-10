#  EthioHealth AI Pro

![EthioHealth](https://img.shields.io/badge/EthioHealth-AI%20Pro-10b981)
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Backend](https://img.shields.io/badge/backend-Render.com-purple)
![Frontend](https://img.shields.io/badge/frontend-GitHub%20Pages-orange)

**AI-Powered Ethiopian Health Companion with Traditional Medicine Database**

---

##  Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Live Demo](#live-demo)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [File Structure](#file-structure)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Deployment](#deployment)
- [Usage Guide](#usage-guide)
- [Disease Detection](#disease-detection)
- [Emergency Features](#emergency-features)


---

##  Overview

**EthioHealth AI Pro** is a comprehensive AI-powered health monitoring application designed specifically for Ethiopian communities. It combines modern AI technology with Ethiopia's rich traditional medicine knowledge.

### Why EthioHealth?

Ethiopia faces unique healthcare challenges:
- 🇪🇹 **60% of population** at risk for malaria
-  **16-20% of adults** affected by hypertension
-  **5-8% diabetes** prevalence (rising in urban areas)
-  **Rich traditional medicine** knowledge being lost
-  **Limited healthcare access** in rural areas
-  **Language barriers** in healthcare delivery

---

##  Features

###  AI Health Analysis
- Real-time disease risk assessment
- Analyzes hypertension, diabetes, malaria, obesity, anemia
- Grok-style AI reasoning with Ethiopian-specific data
- Works offline with local fallback

###  Interactive Symptom Checker
- Clickable body map for symptom selection
- 100+ selectable symptoms
- Severity and duration tracking
- AI-powered disease matching

###  Ethiopian Traditional Medicine Database
- **8 documented medicinal herbs** with full details
- Scientific names, uses, preparations, dosages
- Safety warnings and drug interactions
- Growing regions within Ethiopia

###  Grok AI Health Chat
- Ask health questions in natural language
- Ethiopian-specific health advice
- Diet, malaria, hypertension, diabetes guidance
- Emergency information

###  Emergency SOS
- One-tap call to Ethiopian emergency (907)
- Hospital finder with contact numbers
- Location sharing

###  User Authentication
- JWT-based login/register system
- Guest mode available
- Profile management

### Multilingual Support
- English, Amharic (አማርኛ), Oromo (Afaan Oromoo)
- RTL support for Amharic

### Additional Features
- Responsive design
- Health trend charts
- Offline-first architecture
- Mobile-optimized

---

## Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | [https://melkamukebede.github.io/EthioHealth/](https://firstaid-98y.pages.dev/) |
| **Backend API** | [https://ethiohalth-api.onrender.com/](https://ethiohalth-api.onrender.com/) |
| **API Health Check** | [https://ethiohalth-api.onrender.com/api/health](https://ethiohalth-api.onrender.com/api/health) |

---

##  Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| HTML5 | Structure |
| CSS3 | Styling (Amazon-inspired) |
| JavaScript (Vanilla) | Logic |
| Bootstrap 5.3 | UI Framework |
| Font Awesome 6.5 | Icons |
| Chart.js 4.4 | Health Charts |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime |
| Express.js 4.18 | Web Framework |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| CORS | Cross-Origin Support |
| Helmet.js | Security Headers |

### Deployment
| Service | Purpose |
|---------|---------|
| GitHub Pages | Frontend Hosting |
| Render.com | Backend Hosting |
| GitHub | Version Control |

---

##  File Structure


---

##  API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Create account | No |
| POST | `/api/v1/auth/login` | Login | No |
| GET | `/api/v1/auth/me` | Get profile | Yes |

### Health Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/health/analyze` | Analyze vital signs |
| GET | `/api/v1/health/trends` | Get analysis history |

### Symptom Checker
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/symptoms/analyze` | AI symptom diagnosis |

### Traditional Medicine
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/herbs` | Get all herbs |
| POST | `/api/v1/herbs/check-interactions` | Check herb-drug interactions |

### AI Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/chat` | Grok AI health chat |

### Voice
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/voice/process` | Process voice commands |

---
## 🧪 Test API Endpoints

Click any link below to test the API directly in your browser using Reqbin:

### Quick Tests (GET Requests - Just Click)

| Endpoint | Test Link |
|----------|-----------|
| Home Status | [Test in Reqbin](https://reqbin.com/req/get/ethiohalth-api.onrender.com) |
| Health Check | [Test in Reqbin](https://reqbin.com/req/get/ethiohalth-api.onrender.com/api/health) |
| Get All Herbs | [Test in Reqbin](https://reqbin.com/req/get/ethiohalth-api.onrender.com/api/v1/herbs) |

### Authentication (POST Requests)

| Endpoint | Test Link |
|----------|-----------|
| Register User | [Test in Reqbin](https://reqbin.com/req/post/ethiohalth-api.onrender.com/api/v1/auth/register) |
| Login User | [Test in Reqbin](https://reqbin.com/req/post/ethiohalth-api.onrender.com/api/v1/auth/login) |

**Register Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
---
##  Installation

### Prerequisites
- Node.js 18+ installed
- Git installed
- GitHub account

### Local Setup

```bash
# Clone the repository
git clone https://github.com/Melkamukebede/EthioHealth.git
cd EthioHealth

# Install backend dependencies
cd backend
npm install

# Start backend server
npm run dev

# Open frontend
# Open index.html in your browser
# OR use Live Server in VS Code
