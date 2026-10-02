import React, { useState } from 'react';
import { X, Layers, Database, Code, Cpu, Shield, CheckCircle, Terminal, FileCode } from 'lucide-react';

interface ArchitectureModalProps {
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'stack' | 'arch' | 'db' | 'folders' | 'roadmap' | 'phase1'>('stack');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">CampusConnect AI — System Architecture Blueprint</h2>
              <p className="text-xs text-slate-400">Complete Full-Stack Technical Specifications, ER Models & Execution Roadmap</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-slate-950/50 overflow-x-auto no-scrollbar">
          {[
            { id: 'stack', label: '1. Tech Stack', icon: Code },
            { id: 'arch', label: '2. Architecture', icon: Cpu },
            { id: 'db', label: '3. Database ERD', icon: Database },
            { id: 'folders', label: '4. Folder Structure', icon: FileCode },
            { id: 'roadmap', label: '5. Development Roadmap', icon: Layers },
            { id: 'phase1', label: '6. Phase 1 Plan', icon: Terminal },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          {activeTab === 'stack' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Final Technology Stack</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <h4 className="font-bold text-indigo-400 text-xs uppercase tracking-wider mb-2">Frontend Client</h4>
                  <ul className="space-y-1.5 text-slate-300">
                    <li>• <strong>Framework:</strong> React 19 + TypeScript + Vite 6</li>
                    <li>• <strong>Styling:</strong> Tailwind CSS v4 + Motion</li>
                    <li>• <strong>Icons:</strong> Lucide React</li>
                    <li>• <strong>State Management:</strong> React Context API with LocalStorage sync</li>
                    <li>• <strong>Real-time Simulation:</strong> Event-driven state updates</li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider mb-2">Backend & APIs</h4>
                  <ul className="space-y-1.5 text-slate-300">
                    <li>• <strong>Target Server:</strong> Python 3.11 + FastAPI / Uvicorn</li>
                    <li>• <strong>ORM / Data Layer:</strong> SQLAlchemy 2.0 with Alembic migrations</li>
                    <li>• <strong>Database:</strong> MySQL 8.0 / Amazon RDS or PlanetScale</li>
                    <li>• <strong>Validation:</strong> Pydantic v2 schemas</li>
                    <li>• <strong>Auth:</strong> JWT (HMAC-SHA256) + bcrypt password hashing</li>
                    <li>• <strong>WebSockets:</strong> FastAPI WebSockets for 1-to-1 & Team chats</li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <h4 className="font-bold text-sky-400 text-xs uppercase tracking-wider mb-2">AI / NLP Engine</h4>
                  <ul className="space-y-1.5 text-slate-300">
                    <li>• <strong>Resume Extraction:</strong> PyMuPDF / pdfplumber + spaCy NER</li>
                    <li>• <strong>Semantic Similarity:</strong> Sentence Transformers (`all-MiniLM-L6-v2`)</li>
                    <li>• <strong>Similarity Metric:</strong> Cosine similarity with vector embeddings</li>
                    <li>• <strong>Matching Engine:</strong> 8-factor transparent weighted scoring model</li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <h4 className="font-bold text-purple-400 text-xs uppercase tracking-wider mb-2">DevOps & Security</h4>
                  <ul className="space-y-1.5 text-slate-300">
                    <li>• <strong>Containerization:</strong> Docker multi-stage build</li>
                    <li>• <strong>CORS & Headers:</strong> Strict CORS policy + Helmet security headers</li>
                    <li>• <strong>File Validation:</strong> MIME type & 5MB file-size limits for resumes</li>
                    <li>• <strong>Privacy:</strong> Zero exposure of exact GPS coordinates</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'arch' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Complete System Architecture</h3>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-300">
{`+-----------------------------------------------------------------------------------+
|                            CLIENT TIER (React 19 + Vite)                          |
|  - Student Dashboard   - 3 Matching Modes (Friend, Skill, Team)  - Resume Dropzone |
|  - Real-Time Chat UI   - Team Builder Workspace                  - Admin Analytics |
+------------------------------------------+----------------------------------------+
                                           | REST APIs + WebSocket Handshake
                                           v
+-----------------------------------------------------------------------------------+
|                        APPLICATION TIER (FastAPI / Express)                       |
|  [Auth Middleware (JWT)] --> [Rate Limiter] --> [Pydantic Input Validation]       |
|                                                                                   |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  |   Routers / APIs   |  |  AI Matching Engine  |  |  Resume NLP Pipeline      |  |
|  | - /auth, /users    |  | - Weighted Scoring   |  | - PDF Parsing (PyMuPDF)   |  |
|  | - /discover        |  | - Semantic Embeddings|  | - Skill & Edu NER (spaCy) |  |
|  | - /teams, /chat    |  | - Explainable Reason |  | - Review & Confirm Buffer |  |
|  +--------------------+  +----------------------+  +---------------------------+  |
+------------------------------------------+----------------------------------------+
                                           | SQLAlchemy ORM Connection Pool
                                           v
+-----------------------------------------------------------------------------------+
|                             DATA TIER (MySQL 8.0)                                 |
|  - users, education, skills, user_skills, interests, user_interests, connections   |
|  - messages, teams, team_members, user_projects, notifications, reports           |
+-----------------------------------------------------------------------------------+`}
              </div>
              <p className="text-xs text-slate-400">
                Data flows symmetrically: Client requests go through JWT-verified routes. For matching, student vectors and categorical criteria are scored through an 8-factor explainable engine. For resumes, data is temporarily buffered into an extracted review state before the student decides which parts to commit to their persistent profile.
              </p>
            </div>
          )}

          {activeTab === 'db' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Database ER Diagram Description</h3>
              <p className="text-xs text-slate-400">
                A normalized 3NF relational schema in MySQL ensuring integrity, indexing on frequent search keys (college, city, skills), and zero duplicate records.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-indigo-400 font-bold">1. users</span>
                  <div className="text-slate-400 mt-1">
                    id (PK, UUID), email (UQ), password_hash, full_name, avatar_url, bio, city, approx_lat, approx_lng, privacy_settings (JSON), created_at
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-indigo-400 font-bold">2. education</span>
                  <div className="text-slate-400 mt-1">
                    id (PK), user_id (FK), college, degree, branch, year, semester, cgpa
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-indigo-400 font-bold">3. skills & user_skills</span>
                  <div className="text-slate-400 mt-1">
                    skills: id (PK), name (UQ), category
                    <br />
                    user_skills: id (PK), user_id (FK), skill_id (FK), proficiency_level, years_experience
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-indigo-400 font-bold">4. interests & user_interests</span>
                  <div className="text-slate-400 mt-1">
                    interests: id (PK), name (UQ), category
                    <br />
                    user_interests: id (PK), user_id (FK), interest_id (FK)
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-indigo-400 font-bold">5. connections</span>
                  <div className="text-slate-400 mt-1">
                    id (PK), requester_id (FK), receiver_id (FK), status (PENDING, ACCEPTED, REJECTED, BLOCKED), created_at, updated_at
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-indigo-400 font-bold">6. messages</span>
                  <div className="text-slate-400 mt-1">
                    id (PK), sender_id (FK), receiver_id (FK, nullable), team_id (FK, nullable), content, is_read, created_at
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-indigo-400 font-bold">7. teams & team_members</span>
                  <div className="text-slate-400 mt-1">
                    teams: id (PK), name, description, creator_id (FK), target_size, required_skills (JSON), type, status
                    <br />
                    team_members: id (PK), team_id (FK), user_id (FK), assigned_role, joined_at
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-indigo-400 font-bold">8. projects, notifications, reports</span>
                  <div className="text-slate-400 mt-1">
                    projects (portfolio showcase), notifications (alerts, read flag), reports (moderation audits, status)
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'folders' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Complete Folder Structure</h3>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-300">
{`campusconnect-ai/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app initialization, CORS, WebSockets
│   │   ├── core/
│   │   │   ├── config.py        # Environment variables & Pydantic BaseSettings
│   │   │   └── security.py      # JWT token issuance, verification & bcrypt hashing
│   │   ├── models/              # SQLAlchemy database models
│   │   │   ├── user.py, connection.py, team.py, message.py, project.py
│   │   ├── schemas/             # Pydantic request / response schemas
│   │   │   ├── auth.py, user.py, match.py, team.py
│   │   ├── routers/             # API endpoint handlers
│   │   │   ├── auth.py, users.py, discover.py, teams.py, chat.py, admin.py
│   │   ├── ai/                  # AI matching & NLP engine
│   │   │   ├── matching_engine.py # 8-factor weighted scoring + embeddings
│   │   │   └── resume_nlp.py    # PyMuPDF + spaCy entity extraction
│   │   └── database/
│   │       ├── session.py       # Engine & SessionLocal
│   │       └── base.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI cards, modals, filter bars, navigation
│   │   ├── pages/               # 12+ Pages (Discover, Team Builder, Chat, Resume, etc.)
│   │   ├── services/            # Storage, AI matching, Resume parser, Team builder
│   │   ├── context/             # AuthContext, Persona Switcher
│   │   ├── types/               # TypeScript definitions
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
├── docs/                        # Architecture diagrams, ERD SQL schema
├── .env.example
└── README.md`}
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Full Development Roadmap (17 Phases)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                {[
                  'Phase 1: Project Setup & Repository Scaffolding',
                  'Phase 2: Database Schema & Migration Setup',
                  'Phase 3: JWT Authentication & Password Hashing',
                  'Phase 4: Student Profile Setup & Verification',
                  'Phase 5: Secure PDF Resume Upload Pipeline',
                  'Phase 6: Resume NLP Information Extraction',
                  'Phase 7: Explainable AI Matching Engine (3 Modes)',
                  'Phase 8: Modern Discover Page with Multi-Filters',
                  'Phase 9: Match Details & Factor Breakdown Modal',
                  'Phase 10: Connection System (Send/Accept/Block/Report)',
                  'Phase 11: Real-Time Chat (1-to-1 & Team Channels)',
                  'Phase 12: Flagship "Find My Team" AI Team Builder',
                  'Phase 13: Skill Gap Analysis & Peer Learning',
                  'Phase 14: Admin Dashboard & Community Analytics',
                  'Phase 15: Security Hardening & Rate Limiting',
                  'Phase 16: Automated Testing & Edge Case Validation',
                  'Phase 17: Production Deployment & Dockerization',
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-medium text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'phase1' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Phase 1 Implementation Plan</h3>
              <p className="text-xs text-slate-400">
                Phase 1 establishes the production scaffolding, type contracts, in-memory & persistent storage, AI matching engine with configurable weights, interactive persona switcher, and responsive UI components.
              </p>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Phase 1 Deliverables:</span>
                </div>
                <ul className="space-y-1.5 pl-6 list-disc text-slate-300">
                  <li>Configured Vite + React 19 + TypeScript + Tailwind CSS design system.</li>
                  <li>Implemented TypeScript data contracts in <code>/src/types/index.ts</code>.</li>
                  <li>Implemented 8-factor AI Matching Engine with explainability in <code>/src/services/aiMatching.ts</code>.</li>
                  <li>Implemented Resume NLP extractor with sample resumes in <code>/src/services/resumeParser.ts</code>.</li>
                  <li>Implemented Combinatorial Team Matcher in <code>/src/services/teamBuilder.ts</code>.</li>
                  <li>Pre-seeded 12 realistic college students across top engineering campuses in <code>/src/services/storage.ts</code>.</li>
                  <li>Complete UI pages: Landing, Dashboard, Discover, Team Builder, Chat, Resume Upload, Skill Gap, Admin, and Settings.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>CampusConnect AI • Architectural Master Blueprint</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer transition"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
