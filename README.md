Here is the comprehensive README.md tailored for your professional Isolation Forest deployment using Docker Compose.

# 🛡️ FraudWatch AI: Isolation Forest Edition
A full-stack, end-to-end Machine Learning application for real-time credit card fraud detection. This project uses an **Isolation Forest** model exported to **ONNX** for high-performance inference, a **FastAPI** backend, and a **React** dashboard.
## 📊 Model Performance- **Algorithm:** Isolation Forest (`contamination=0.05`)- **Recall:** 0.90 (Successfully flags 90% of all fraud cases)- **ROC AUC:** 0.93
- **Selected Features (11):** `V2, V4, V7, V11, V12, V14, V16, V17, V18, V19, Hour`
## 🏗️ Project Architecture- **Machine Learning:** Scikit-Learn → ONNX Runtime (Inference)- **Backend:** FastAPI (Python), SQLModel (ORM), JWT Authentication- **Database:** PostgreSQL (Stores Incident Logs and User Data)- **Frontend:** Vite + React, Tailwind CSS, Recharts (Real-time visualization)- **Deployment:** Docker & Docker Compose
## 📂 Required Model FilesBefore launching, ensure the following files are in the `backend/ml_models/` directory:
1. `iso_forest.onnx` — The exported Isolation Forest model.
2. `iso_scaler.pkl` — The StandardScaler fitted on the 11 specific features.
---## 🚀 Getting Started (Docker Deployment)### 1. Prerequisites- [Docker Desktop](https://docker.com) installed and running.- Git installed.
### 2. Launch the EnvironmentOpen your terminal in the project root directory and run:

```powershell
# Build and start all services (Database, Backend, Frontend)
docker compose up --build -d

## 3. Access the Application

* Dashboard (UI): http://localhost
* API Documentation: http://localhost:8000/docs
* Database: Internal PostgreSQL accessible on port 5432

------------------------------
## 🛠️ Development & Testing## Initial Setup (Local User)

   1. Navigate to http://localhost:8000/docs.
   2. Use the POST /auth/register endpoint to create an account.
   3. Use the POST /auth/token endpoint to verify your JWT generation.


## 📁 Repository Structure

├── backend/
│   ├── app/                # FastAPI logic (API, Models, Services, Core)
│   ├── ml_models/          # .onnx and .pkl files
│   └── Dockerfile          # Python-slim environment
├── frontend/
│   ├── src/                # React components and Dashboard logic
│   ├── public/
│   └── Dockerfile          # Multi-stage Nginx build
├── notebooks/              # Jupyter research and model export logic
└── docker-compose.yml      # Service orchestration

------------------------------
## 🛡️ Security

* JWT Auth: All sensitive endpoints (History/Prediction) are protected via Bearer tokens.
* Bcrypt: Passwords are salted and hashed before storage in PostgreSQL.
* Persistence: Database records are persisted across container restarts via Docker Volumes.
