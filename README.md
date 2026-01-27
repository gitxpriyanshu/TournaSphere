# 🏆 TournaSphere: The Ultimate Competitive Matrix

![TournaSphere Banner](https://raw.githubusercontent.com/lucide-react/lucide/main/icons/trophy.svg)

**TournaSphere** is a high-fidelity, premium tournament management platform designed for the modern competitive era. Featuring a stunning **Glassmorphic UI**, a robust **FastAPI backend**, and a dynamic **Strategy-based Bracket Engine**, it provides a seamless command center for organizers and a premium experience for athletes.

---

## ✨ Premium Features

### 🌌 Elite Visual Experience
- **Glassmorphic Design**: A state-of-the-art interface utilizing frosted-glass effects, vibrant gradients, and high-contrast typography.
- **Sporty Matrix Calendar**: A custom-built, high-fidelity date/time picker with a 12-hour AM/PM system and matrix-style aesthetics.
- **Dynamic Brackets**: Visual VS cards that bridge teams together in a sleek, responsive grid.

### 🧠 Advanced Engine Logic
- **Strategy-Based Brackets**: Utilizing the **Strategy Design Pattern** to support multiple tournament formats (Knockout/Single Elimination currently active).
- **Real-Time Leaderboards**: Automated ranking system calculating points (Win=3, Draw=1, Loss=0) and goal differences instantly upon match commitment.
- **Temporal & Spatial Mapping**: Assign precise "Temporal Nodes" (Time) and "Spatial Coordinates" (Venue) to every encounter.

### 🛡️ Administrative Command
- **Multi-Role Ecosystem**: Distinct permission layers for **Admins**, **Organizers**, and **Team Captains**.
- **Result Commitment**: Secure scoring interface with automated ranking triggers.
- **Roster Management**: Full control over team approvals and player statistics.

---

## 🏗️ Technical Architecture

### **Backend (The Core)**
- **Framework**: FastAPI (Python 3.11+)
- **ORM**: SQLAlchemy with PostgreSQL
- **Security**: OAuth2 with JWT Bearer Token validation and Bcrypt hashing.
- **Patterns**: Repository Pattern for data abstraction and Strategy Pattern for bracket generation.

### **Frontend (The Interface)**
- **Library**: React.js with Vite
- **Styling**: Vanilla CSS + Tailwind CSS for the glassmorphic system.
- **Icons**: Lucide React for high-definition vector symbols.
- **State**: React Context API for global authentication and domain synchronization.

### **Orchestration**
- **Containerization**: Docker & Docker Compose for unified environment parity.

---

## 🚀 Rapid Deployment

### **Prerequisites**
- Docker & Docker Compose
- Node.js (for local dev)
- Python 3.11+ (for local dev)

### **Docker Setup (Recommended)**
```bash
# 1. Clone the repository
git clone https://github.com/gitxpriyanshu/TournaSphere.git
cd TournaSphere

# 2. Spin up the entire matrix
docker compose up --build

# 3. Seed the initial data (In a new terminal)
docker compose exec backend python seed_data.py
```
*Access the platform at `http://localhost:5173`*

---

## 📂 Project Anatomy

```text
TournaSphere/
├── backend/                # FastAPI Microservice
│   ├── controllers/        # API Endpoints (Auth, Tournament, Match)
│   ├── models/             # SQLAlchemy Database Entities
│   ├── services/           # Core Business Logic (Leaderboard, Scoring)
│   ├── utils/              # Bracket Engine (Strategy Pattern) & Security
│   └── repositories/       # Data Access Layer
├── frontend/               # React (Vite) Application
│   ├── src/pages/          # Glassmorphic UI (Leaderboard, ManageMatches)
│   ├── src/components/     # Reusable Matrix Components
│   └── public/             # Brand Assets (Premium Favicon)
└── docker-compose.yml      # Service Orchestration
```

---

## 🎨 Brand Identity
The **TournaSphere** logo represents the interlocking nature of competition—a multi-faceted sphere composed of vibrant orange and rose gold gradients, housing the silhouette of the ultimate prize: the Trophy.

---

## 🤝 Contribution
The circuit is open. If you wish to optimize the matrix:
1. Fork the Domain.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

**Author: Priyanshu Verma**
