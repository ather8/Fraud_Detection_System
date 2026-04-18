# 🛡️ Fraud Detection System

A full-stack **credit card fraud / anomaly detection** platform that pairs an
unsupervised **Isolation Forest** model with a modern web dashboard.
Transactions are scored in real time by a FastAPI service, persisted to
PostgreSQL, and visualised through a React + Vite frontend — all orchestrated
with Docker Compose.

---

## ✨ Features

- 🤖 **ML-powered anomaly detection** using scikit-learn's Isolation Forest
- ⚡ **FastAPI** backend exposing a clean REST API for scoring transactions
- 🐘 **PostgreSQL** "Incident Log" that persists every flagged transaction
- 🎨 **React + Vite + Tailwind CSS + shadcn/ui** dashboard for analysts
- 📓 **Jupyter notebook** documenting the data exploration & model training
- 🐳 **Dockerised** — one command spins up DB, API, and UI together

---

## 📸 Screenshots

A visual tour of the dashboard and core flows.

### 🔐 Login
![Login](./Screenshots/Login.png)

### 🏠 Home
![Home](./Screenshots/Home.png)

### 📡 Live Feed
![Live Feed](./Screenshots/Live%20Feed.png)

### 🔮 Prediction
![Prediction](./Screenshots/Prediction.png)

### ✅ Normal Transaction
![Normal Transaction](./Screenshots/Normal%20Transaction.png)

### 🚨 Fraudulent Transaction
![Fraudulent Transaction](./Screenshots/Fraudlant%20Transaction.png)

### 📊 Performance
![Performance](./Screenshots/Performance.png)

### 🧠 Model Info
![Model Info](./Screenshots/Model%20Info.png)

---

## 🏗️ Architecture

```
┌────────────────┐      HTTP      ┌────────────────┐     SQL    ┌──────────────┐
│  React (Vite)  │  ───────────▶  │ FastAPI + ML   │ ─────────▶ │  PostgreSQL  │
│   Dashboard    │  ◀───────────  │ Isolation Frst │ ◀───────── │  fraud_db    │
└────────────────┘    JSON        └────────────────┘            └──────────────┘
       :80                              :8000                         :5432
```

---

## 📁 Project Structure

```
Fraud_Detection_System/
├── backend/                # FastAPI service + ML model
│   ├── app/                # API routes, schemas, ML logic
│   ├── Dockerfile
│   ├── requirements.txt
│   └── fraud_db.db         # SQLite fallback (Postgres used in Docker)
├── frontend/               # React + Vite + Tailwind UI
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── notebooks/
│   └── Anomaly_Detection_in_Credit_Card_Transactions.ipynb
├── Screenshots/            # UI screenshots used in this README
├── docker-compose.yml      # Orchestrates db + backend + frontend
├── run_project.sh          # Convenience launcher
└── README.md
```

---

## 🚀 Quick Start (Docker — recommended)

> Requires **Docker** and **Docker Compose**.

```bash
# 1. Clone the repository
git clone https://github.com/ather8/Fraud_Detection_System.git
cd Fraud_Detection_System

# 2. Build & start everything
docker compose up --build
```

Once the containers are healthy:

| Service   | URL                                              |
|-----------|--------------------------------------------------|
| Frontend  | http://localhost                                 |
| Backend   | http://localhost:8000                            |
| API Docs  | http://localhost:8000/docs (Swagger UI)          |
| Database  | `postgresql://postgres:postgres@localhost:5432/fraud_db` |

To stop:

```bash
docker compose down
```

To reset the database volume:

```bash
docker compose down -v
```

You can also use the helper script:

```bash
chmod +x run_project.sh
./run_project.sh
```

---

## 🧑‍💻 Local Development (without Docker)

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend (React + Vite)

```bash
cd frontend
npm install            # or: bun install
npm run dev
```

The dev server will start on http://localhost:5173 by default.

---

## 📓 Notebook

The `notebooks/` folder contains the full data-science workflow used to design
the detector:

- Exploratory data analysis on credit card transactions
- Feature engineering & scaling
- Training and evaluating the **Isolation Forest** model
- Exporting the trained model for the FastAPI service

Open it with:

```bash
jupyter notebook notebooks/Anomaly_Detection_in_Credit_Card_Transactions.ipynb
```

---

## 🛠️ Tech Stack

**Backend / ML**
- Python 3.11
- FastAPI, Uvicorn
- scikit-learn (Isolation Forest)
- pandas, NumPy
- SQLAlchemy + PostgreSQL

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- TanStack Query, React Router

**Infrastructure**
- Docker & Docker Compose
- PostgreSQL 15 (Alpine)
- Nginx (serving the production frontend build)

---

## 🔌 API Overview

Once the backend is running, full interactive docs are available at
**http://localhost:8000/docs**.

Typical endpoints include:

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| POST   | `/predict`            | Score a single transaction           |
| GET    | `/incidents`          | List all flagged transactions        |
| GET    | `/incidents/{id}`     | Retrieve a specific incident         |
| GET    | `/health`             | Liveness check                       |

Example request:

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"amount": 1234.56, "features": [/* V1..V28 */]}'
```

---

## 🗄️ Environment Variables

The backend reads its database connection from `DATABASE_URL`.
Defaults are set in `docker-compose.yml`:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/fraud_db
```

For local development you can copy and adjust as needed.

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-thing`)
3. Commit your changes (`git commit -m 'Add amazing thing'`)
4. Push to the branch (`git push origin feature/amazing-thing`)
5. Open a Pull Request

---

## 📄 License

This project is released under the MIT License — see `LICENSE` for details.

---

## 👤 Author

**Ather Sayed** — [@ather8](https://github.com/ather8)

If this project helped you, please consider giving it a ⭐ on GitHub!
