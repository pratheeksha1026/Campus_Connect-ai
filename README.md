# CampusConnect AI

> **"Find Your People. Build Your Team. Create Something Together."**

CampusConnect AI is an AI-powered student networking and collaboration platform designed for college and engineering students. The platform uses resume processing, NLP, semantic similarity, and an 8-factor transparent recommendation engine to generate explainable compatibility scores. Students can connect, communicate, collaborate on projects, and intelligently form teams for hackathons and technical competitions.

---

## 🌟 Key Differentiators & Features

### 1. Three Specialized Matching Engines
- **Mode A: Friend Match** — Discovers peers based on lifestyle hobbies, music, movies, gaming, sports, photography, and campus proximity.
- **Mode B: Skill Match** — Identifies technical complementarity (e.g. Student A with Python/ML paired with Student B with React/Tailwind/UI).
- **Mode C: Team Match (Flagship Feature)** — Enter a hackathon or capstone project spec (title, description, required skills, team size); the AI determines the optimal multi-disciplinary squad, computes total team synergy score, and assigns specific roles (ML Lead, Frontend Lead, Backend Architect, UI/UX Designer).

### 2. Resume Upload & NLP Information Extraction
- Secure PDF & text resume processing.
- NLP extracts Candidate Name, College, Degree, Branch, Year, Skills, Projects, and Certifications.
- **Review & Confirm Guardrail:** Extracted information is presented in an interactive card allowing the student to inspect, edit, or remove items before merging with their profile.

### 3. Transparent & Explainable AI Matching
- Configurable 8-factor weighted scoring:
  - Technical Skills (25%)
  - Interests & Hobbies (15%)
  - Project Goals (15%)
  - Geographic Proximity (10%)
  - Academic Branch (10%)
  - Hackathon Intent (10%)
  - Career Alignment (10%)
  - Academic Year (5%)
- Visual radar/factor progress bars for every match.
- Clear, human-readable reasons explaining common ground, complementary skills, and differences.

### 4. Verified Student Connections & Real-Time Chat
- Send, accept, reject, cancel, or remove connections.
- Only mutually accepted connections can initiate direct 1-to-1 chats.
- Collaborative Team Chat channels for formed hackathon squads.
- Online presence indicators and message status.

### 5. Skill Gap Analysis & Peer Learning
- Select target career paths (Machine Learning Engineer, Full Stack Web Architect, Cloud DevOps, Cybersecurity Analyst, UI/UX Designer).
- Visualizes skills you have vs skills you need.
- Connects you directly with students in the network who master those exact missing skills.

### 6. Student Project Showcase
- Portfolio board for Idea, In Progress, and Completed projects with GitHub repo and live demo links.

### 7. Administrative Oversight & Analytics
- Live dashboard displaying active students, formed teams, popular skills chart, and campus geographic distribution.
- Audit moderation log to review reports and suspend abusive accounts.

### 8. Privacy & Safety First
- Zero exact address/GPS exposure (approximate city/locality only).
- Granular visibility toggles for profile, location, resume, and external links.
- Instant user block and report mechanism.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, Motion, Lucide Icons |
| **State & Persistence** | React Context API, LocalStorage persistence with in-memory sync |
| **Target Backend** | Python 3.11, FastAPI, Uvicorn, SQLAlchemy 2.0, Pydantic v2 |
| **Target Database** | MySQL 8.0 (Normalized 3NF relational schema in `/docs/database_schema.sql`) |
| **AI / NLP** | PyMuPDF, spaCy, Sentence Transformers (`all-MiniLM-L6-v2`), Cosine Similarity |
| **Security** | JWT (HMAC-SHA256), bcrypt password hashing, CORS protection, file-type validation |

---

## 📁 Repository Structure

```text
campusconnect-ai/
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── Navbar.tsx         # Top navigation with persona switcher
│   │   ├── Footer.tsx         # Footer with quick links
│   │   ├── StudentCard.tsx    # Modern student match card
│   │   ├── MatchDetailsModal.tsx # 8-factor explainable breakdown
│   │   ├── FilterBar.tsx      # Multi-mode discover filter bar
│   │   ├── ReportModal.tsx    # Safety report & block modal
│   │   └── ArchitectureModal.tsx # System blueprint modal
│   ├── pages/                 # Full feature views
│   │   ├── LandingPage.tsx    # Hero & value proposition
│   │   ├── DashboardPage.tsx  # Overview & completeness ring
│   │   ├── DiscoverPage.tsx   # Multi-mode peer discovery
│   │   ├── TeamBuilderPage.tsx # Flagship AI hackathon team formation
│   │   ├── ConnectionsPage.tsx # Connection requests & accepted list
│   │   ├── ChatPage.tsx       # 1-to-1 & team real-time chat
│   │   ├── ProjectsPage.tsx   # Student project showcase
│   │   ├── SkillGapPage.tsx   # Career path & peer mentor discovery
│   │   ├── ResumeUploadPage.tsx # PDF & NLP resume parser
│   │   ├── ProfilePage.tsx    # Student profile viewing & editing
│   │   ├── SettingsPage.tsx   # Privacy toggles & algorithm weights
│   │   ├── AdminPage.tsx      # Analytics & moderation
│   │   └── AuthModal.tsx      # Student registration & login
│   ├── services/
│   │   ├── storage.ts         # Persistent data layer with 12+ pre-seeded students
│   │   ├── aiMatching.ts      # 8-factor explainable matching algorithm
│   │   ├── resumeParser.ts    # Resume extraction & sample CV data
│   │   └── teamBuilder.ts     # Combinatorial team optimizer
│   ├── context/
│   │   └── AuthContext.tsx    # Global session & persona switcher
│   ├── types/
│   │   └── index.ts           # Complete TypeScript interfaces
│   ├── App.tsx                # Master application router & modal coordinator
│   └── main.tsx
├── docs/
│   ├── architecture.md        # Detailed architectural specifications
│   └── database_schema.sql    # MySQL normalized 3NF database schema
├── .env.example
├── metadata.json
└── package.json
```

---

## 🚀 Running the Application

### 1. Installation
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
The app will be available on `http://localhost:3000`.

### 3. Build & Production Check
```bash
npm run build
```

---

## 🧪 Interactive Demo Personas

CampusConnect includes pre-seeded realistic student profiles across Indian engineering campuses (NIE Mysuru, SJCE Mysuru, PES University, RVCE Bangalore, BMSCE).

To test interactions between peers without creating multiple accounts:
1. Click the **Role Switcher** in the top navbar (e.g. `Pratheeksha P. (AI/ML Lead)`).
2. Switch to **Sneha Rao (React / Frontend)** or **Aditya Kulkarni (Backend)**.
3. Accept incoming connection requests, send messages, or form teams seamlessly.
4. Switch to **CampusConnect Admin** to review moderation logs and analytics.

---

## 📄 License
Licensed under Apache-2.0. Built for student innovation and peer collaboration.
