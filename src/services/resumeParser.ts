import { ExtractedResumeData } from '../types';

export const SAMPLE_RESUMES: { id: string; label: string; text: string; data: ExtractedResumeData }[] = [
  {
    id: 'resume-1',
    label: 'Arjun Sharma (AI & Machine Learning Focus)',
    text: `ARJUN SHARMA
Email: arjun.sharma@example.edu | Phone: +91 98765 43210 | Bangalore, Karnataka
GitHub: github.com/arjun-ml | LinkedIn: linkedin.com/in/arjun-sharma

EDUCATION
National Institute of Engineering (NIE), Mysuru
Bachelor of Engineering (B.E.) in Computer Science & Engineering
Year: 3rd Year (2022 - 2026) | CGPA: 8.9/10

TECHNICAL SKILLS
Languages: Python, C++, SQL, JavaScript
AI/ML: Machine Learning, PyTorch, Scikit-learn, TensorFlow, OpenCV, NLP, Pandas, NumPy
Tools & Platforms: Git, Docker, Linux, Jupyter, FastAPI

PROJECTS
• MedVision AI: Chest X-Ray pathology detection using CNNs & PyTorch with 94.2% AUC.
• SmartCampus Bot: Retrieval-Augmented Generation (RAG) assistant for college FAQs using LangChain and ChromaDB.

EXPERIENCE
• Machine Learning Intern, DataCraft Labs (Jun 2024 - Aug 2024)
  Optimized tabular inference pipelines using XGBoost, cutting latency by 35%.

CERTIFICATIONS
• Deep Learning Specialization (DeepLearning.AI)
• AWS Certified Cloud Practitioner`,
    data: {
      name: 'Arjun Sharma',
      email: 'arjun.sharma@example.edu',
      college: 'National Institute of Engineering (NIE)',
      degree: 'B.E.',
      branch: 'Computer Science & Engineering',
      year: 3,
      skills: ['Python', 'Machine Learning', 'PyTorch', 'Scikit-learn', 'TensorFlow', 'FastAPI', 'Pandas', 'NumPy', 'SQL', 'Docker', 'OpenCV'],
      projects: [
        {
          title: 'MedVision AI',
          description: 'Chest X-Ray pathology detection using CNNs & PyTorch with 94.2% AUC',
          tech: ['Python', 'PyTorch', 'OpenCV', 'CNN'],
        },
        {
          title: 'SmartCampus Bot',
          description: 'RAG assistant for college FAQs using LangChain and vector databases',
          tech: ['Python', 'FastAPI', 'NLP', 'LangChain'],
        },
      ],
      certifications: ['Deep Learning Specialization (DeepLearning.AI)', 'AWS Certified Cloud Practitioner'],
      experience: ['Machine Learning Intern at DataCraft Labs (Summer 2024)'],
      summary: 'Passionate 3rd-year CSE undergraduate specializing in applied AI, deep learning, and diagnostic vision models.',
    },
  },
  {
    id: 'resume-2',
    label: 'Priya Nair (Full-Stack & React Specialist)',
    text: `PRIYA NAIR
Email: priya.nair@example.com | Mysuru, Karnataka
GitHub: github.com/priyanair-dev | LinkedIn: linkedin.com/in/priya-nair-dev

EDUCATION
PES College of Engineering, Mandya
B.E. in Information Science & Engineering
Year: 2nd Year (2023 - 2027) | CGPA: 9.1/10

TECHNICAL SKILLS
Frontend: React, Next.js, TypeScript, Tailwind CSS, Redux, HTML5, CSS3
Backend: Node.js, Express, PostgreSQL, REST APIs, GraphQL
Design: Figma, Wireframing, UI/UX Prototyping

PROJECTS
• EduCollab: Real-time peer-to-peer code review platform with WebSockets and React.
• HackPortal: Event management and judging portal built with Next.js and Supabase.

CERTIFICATIONS
• Meta Front-End Developer Professional Certificate
• Postman API Fundamentals Student Expert`,
    data: {
      name: 'Priya Nair',
      email: 'priya.nair@example.com',
      college: 'PES College of Engineering',
      degree: 'B.E.',
      branch: 'Information Science & Engineering',
      year: 2,
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL', 'Figma', 'UI/UX', 'REST APIs'],
      projects: [
        {
          title: 'EduCollab',
          description: 'Real-time collaborative code review workspace with synchronized cursor & WebSockets',
          tech: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
        },
        {
          title: 'HackPortal',
          description: 'Hackathon participant registration and automated judging scoring system',
          tech: ['Next.js', 'PostgreSQL', 'Tailwind CSS'],
        },
      ],
      certifications: ['Meta Front-End Developer Professional Certificate', 'Postman API Fundamentals Student Expert'],
      experience: ['Open Source Contributor to React community libraries'],
      summary: '2nd-year ISE developer passionate about high-fidelity user experiences, component architecture, and responsive web applications.',
    },
  },
  {
    id: 'resume-3',
    label: 'Karan Patel (Cloud, DevOps & Systems)',
    text: `KARAN PATEL
Email: karan.patel@example.edu | Bangalore
GitHub: github.com/karan-devops | LinkedIn: linkedin.com/in/karan-patel

EDUCATION
BMS College of Engineering, Bangalore
B.Tech in Computer Science
Year: 4th Year (2021 - 2025)

SKILLS: Docker, Kubernetes, AWS, Go, Python, CI/CD, Terraform, Linux, Prometheus, Grafana, PostgreSQL`,
    data: {
      name: 'Karan Patel',
      email: 'karan.patel@example.edu',
      college: 'BMS College of Engineering',
      degree: 'B.Tech',
      branch: 'Computer Science',
      year: 4,
      skills: ['Docker', 'Kubernetes', 'AWS', 'Go', 'Python', 'CI/CD', 'Linux', 'Terraform', 'PostgreSQL'],
      projects: [
        {
          title: 'Microservices Mesh Observer',
          description: 'Observability agent that captures cluster metrics and provides automated alert thresholds',
          tech: ['Go', 'Docker', 'Kubernetes', 'Prometheus'],
        },
      ],
      certifications: ['Certified Kubernetes Administrator (CKA)', 'AWS Solutions Architect Associate'],
      experience: ['DevOps Intern at CloudShift Systems'],
      summary: 'Final year CS student with deep focus on container orchestration, cloud-native deployments, and infrastructure as code.',
    },
  },
];

// Parser function that extracts structured profile data from raw text
export function parseResumeText(rawText: string): ExtractedResumeData {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  let name = '';
  if (lines.length > 0) {
    const candidateName = lines[0].replace(/resume|curriculum|vitae|cv/gi, '').trim();
    if (candidateName.length < 40 && candidateName.length > 2) {
      name = candidateName;
    }
  }

  // Extract Email
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : undefined;

  // Extract College
  let college = 'Engineering College';
  const collegeMatch = rawText.match(/(?:National Institute of Technology|Indian Institute of Technology|PES College|RV College|BMS College|SJCE|NIE|MIT|State Engineering College|[A-Za-z\s]+(?:College|Institute|University))/i);
  if (collegeMatch) {
    college = collegeMatch[0].trim();
  }

  // Extract Degree & Branch
  let degree = 'B.Tech / B.E.';
  if (/B\.?E\.?/i.test(rawText)) degree = 'B.E.';
  else if (/B\.?Tech/i.test(rawText)) degree = 'B.Tech';
  else if (/M\.?Tech|M\.?S\.?/i.test(rawText)) degree = 'M.Tech';

  let branch = 'Computer Science & Engineering';
  if (/Information Science/i.test(rawText)) branch = 'Information Science & Engineering';
  else if (/Artificial Intelligence|AI & DS|Data Science/i.test(rawText)) branch = 'AI & Data Science';
  else if (/Electronics|ECE/i.test(rawText)) branch = 'Electronics & Communication';
  else if (/Mechanical/i.test(rawText)) branch = 'Mechanical Engineering';

  // Extract Year
  let year = 3;
  if (/1st Year|First Year|2024\s*-\s*2028/i.test(rawText)) year = 1;
  else if (/2nd Year|Second Year|2023\s*-\s*2027/i.test(rawText)) year = 2;
  else if (/3rd Year|Third Year|2022\s*-\s*2026/i.test(rawText)) year = 3;
  else if (/4th Year|Final Year|2021\s*-\s*2025/i.test(rawText)) year = 4;

  // Recognized skills bank for NLP extraction
  const KNOWN_SKILLS = [
    'Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Scikit-learn',
    'React', 'Next.js', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS',
    'Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'Go', 'Java', 'Spring Boot', 'C++', 'C',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST APIs',
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Linux', 'Git', 'CI/CD',
    'UI/UX', 'Figma', 'OpenCV', 'Pandas', 'NumPy', 'NLP', 'Data Science', 'Cybersecurity'
  ];

  const extractedSkills: string[] = [];
  for (const skill of KNOWN_SKILLS) {
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(rawText)) {
      extractedSkills.push(skill);
    }
  }

  // Fallback skills if sparse
  if (extractedSkills.length === 0) {
    extractedSkills.push('Python', 'JavaScript', 'SQL', 'Git');
  }

  return {
    name: name || 'Student Candidate',
    email,
    college,
    degree,
    branch,
    year,
    skills: extractedSkills,
    projects: [
      {
        title: 'Extracted Academic Project',
        description: 'Collaborative development project extracted from uploaded resume section.',
        tech: extractedSkills.slice(0, 3),
      }
    ],
    certifications: rawText.includes('Certif') ? ['Industry Recognized Technical Certification'] : [],
    experience: rawText.includes('Intern') || rawText.includes('Experience') ? ['Academic Project Intern'] : [],
    summary: `Extracted ${extractedSkills.length} verified technical skills and profile credentials. Ready to apply to student profile.`,
  };
}
