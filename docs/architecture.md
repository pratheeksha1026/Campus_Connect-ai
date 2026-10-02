# CampusConnect AI — System Architecture & Implementation Blueprint

## 1. Executive Summary
**CampusConnect AI** is a production-grade full-stack web platform purpose-built for college and engineering students. Rather than acting as a generic social network, the core purpose is:
> **"Use explainable AI to determine which students are compatible, form multi-disciplinary hackathon teams, and explain WHY they match."**

---

## 2. Core Architectural Components

### A. Frontend Layer (React 19 + TypeScript + Vite 6 + Tailwind CSS v4)
- **Modular Component Design:** Atomic card components, responsive modals, and real-time state listeners.
- **Three Matching Modes Viewports:**
  - `FRIEND_MATCH`: Focuses on hobbies, movies, music, gaming, city, and college year.
  - `SKILL_MATCH`: Emphasizes technical complementarity (e.g., ML Specialist paired with Frontend/React Architect).
  - `TEAM_MATCH`: Flagship hackathon team builder evaluating multi-disciplinary role coverage.
- **Resume NLP Pipeline:** File dropzone supporting client & server extraction, displaying structured preview before committing to user profile.
- **Persona Switcher:** Interactive testing widget allowing developers & evaluators to switch between personas (Student A, Student B, Admin) instantly.

### B. AI & Recommendation Engine
- **Weighted 8-Factor Model:**
  - Technical Skills (25%)
  - Interests & Hobbies (15%)
  - Project Goals (15%)
  - Proximity / Location (10%)
  - Academic Branch (10%)
  - Hackathon Readiness (10%)
  - Career Alignment (10%)
  - Academic Year (5%)
- **Semantic Similarity:** Embeddings & semantic skill taxonomy (recognizing that *PyTorch* and *Deep Learning* are related, or *React* and *Next.js* are complementary).
- **Explainable Output:** Returns individual factor progress bars, shared common ground, complementary skills, and constructive differences.

### C. Backend API Specifications (FastAPI Target Blueprint)
- `POST /auth/register` — Validates email, hashes password with bcrypt, initializes profile.
- `POST /auth/login` — Issues HMAC-SHA256 JWT access token.
- `GET /users/me` & `PUT /users/me` — Read and update personal profile & privacy toggles.
- `POST /resume/extract` — Accepts PDF, runs NLP entity recognition, returns review payload.
- `GET /discover` — Returns ranked match results with explainable reasoning.
- `POST /connections` — Manages connection state machine (`PENDING`, `ACCEPTED`, `REJECTED`, `BLOCKED`).
- `GET /chat/messages` & `WS /ws/chat` — Real-time WebSockets for one-on-one and team messaging.
- `POST /teams/recommend` — Combinatorial search for optimal 2-6 member hackathon squads.

---

## 3. Privacy & Security Constitution
1. **Zero Exact GPS Exposure:** Coordinates are fuzzed to city/locality level.
2. **Review-Before-Commit:** Extracted resumes never overwrite profiles automatically.
3. **Restricted Direct Messaging:** Only mutually accepted connections can initiate chats.
4. **Moderation Pipeline:** Audit logs, report mechanisms, and administrative suspension.
