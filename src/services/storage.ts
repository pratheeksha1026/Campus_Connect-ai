import {
  User,
  Connection,
  Message,
  Team,
  UserProject,
  NotificationItem,
  Report,
  MatchingWeights
} from '../types';
import { DEFAULT_WEIGHTS } from './aiMatching';

// Initial pre-seeded student dataset
export const INITIAL_STUDENTS: User[] = [
  {
    id: 'user-1',
    name: 'Pratheeksha P.',
    email: 'pratheekshap606@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    bio: 'CSE 3rd year at NIE Mysuru. Passionate about Deep Learning, Diagnostic AI, and building hackathon-winning prototypes!',
    city: 'Mysuru',
    approxLocation: { lat: 12.2958, lng: 76.6394, area: 'Manandavadi Road' },
    education: {
      college: 'National Institute of Engineering (NIE)',
      degree: 'B.E.',
      branch: 'Computer Science & Engineering',
      year: 3,
      semester: 6,
      cgpa: 9.2,
    },
    skills: [
      { name: 'Python', level: 'Expert', yearsOfExp: 3 },
      { name: 'Machine Learning', level: 'Advanced', yearsOfExp: 2 },
      { name: 'PyTorch', level: 'Intermediate', yearsOfExp: 2 },
      { name: 'SQL', level: 'Advanced', yearsOfExp: 2 },
      { name: 'FastAPI', level: 'Intermediate', yearsOfExp: 1 },
      { name: 'Data Science', level: 'Advanced', yearsOfExp: 2 },
    ],
    lookingForSkills: ['React', 'UI/UX', 'Node.js', 'Figma'],
    interests: ['AI', 'Hackathons', 'Movies', 'Gaming', 'Music', 'Robotics'],
    connectionGoals: ['Find hackathon teammates', 'Find project partners', 'Make friends', 'Networking'],
    hackathonInterests: ['Smart Healthcare', 'FinTech AI', 'EdTech'],
    experience: ['AI Research Intern at C-DAC (Summer 2024)', 'Core Member, Google Developer Student Club NIE'],
    certifications: ['DeepLearning.AI TensorFlow Specialization', 'NPTEL Cloud Computing (Silver Medal)'],
    linkedinUrl: 'https://linkedin.com/in/pratheeksha-p',
    githubUrl: 'https://github.com/pratheeksha-ai',
    portfolioUrl: 'https://pratheeksha.dev',
    privacy: {
      profileVisibility: 'public',
      showLocation: true,
      showResume: true,
      showSocialLinks: true,
      allowRequestsFrom: 'everyone',
    },
    isOnline: true,
    lastActive: 'Just now',
    role: 'student',
  },
  {
    id: 'user-2',
    name: 'Sneha Rao',
    email: 'sneha.rao@nie.ac.in',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
    bio: 'Full-stack React dev & UI enthusiast. Love building pixel-perfect responsive web apps with clean motion.',
    city: 'Mysuru',
    approxLocation: { lat: 12.3051, lng: 76.6551, area: 'Kuvempunagar' },
    education: {
      college: 'National Institute of Engineering (NIE)',
      degree: 'B.E.',
      branch: 'Information Science & Engineering',
      year: 3,
      semester: 6,
      cgpa: 8.8,
    },
    skills: [
      { name: 'React', level: 'Expert', yearsOfExp: 3 },
      { name: 'Next.js', level: 'Advanced', yearsOfExp: 2 },
      { name: 'TypeScript', level: 'Advanced', yearsOfExp: 2 },
      { name: 'Tailwind CSS', level: 'Expert', yearsOfExp: 3 },
      { name: 'UI/UX', level: 'Advanced', yearsOfExp: 2 },
      { name: 'Figma', level: 'Advanced', yearsOfExp: 2 },
    ],
    lookingForSkills: ['Python', 'Machine Learning', 'Docker', 'FastAPI'],
    interests: ['AI', 'Hackathons', 'Movies', 'Photography', 'Music', 'Design'],
    connectionGoals: ['Find hackathon teammates', 'Find project partners', 'Make friends'],
    hackathonInterests: ['Smart Healthcare', 'Web3 & AI', 'Open Innovation'],
    experience: ['Frontend Intern at CodeNest Solutions', 'Lead Designer for College Fest Tech Portal'],
    certifications: ['Meta Frontend Developer Certification'],
    linkedinUrl: 'https://linkedin.com/in/sneha-rao-dev',
    githubUrl: 'https://github.com/snehar-frontend',
    portfolioUrl: 'https://sneharao.me',
    privacy: {
      profileVisibility: 'public',
      showLocation: true,
      showResume: true,
      showSocialLinks: true,
      allowRequestsFrom: 'everyone',
    },
    isOnline: true,
    lastActive: '5m ago',
    role: 'student',
  },
  {
    id: 'user-3',
    name: 'Aditya Kulkarni',
    email: 'aditya.k@sjce.ac.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    bio: 'Backend architect & database geek. I turn complex requirements into high-throughput microservices.',
    city: 'Mysuru',
    approxLocation: { lat: 12.3160, lng: 76.6133, area: 'Jayalakshmipuram' },
    education: {
      college: 'Sri Jayachamarajendra College of Engineering (SJCE)',
      degree: 'B.E.',
      branch: 'Computer Science & Engineering',
      year: 3,
      semester: 6,
      cgpa: 9.0,
    },
    skills: [
      { name: 'Node.js', level: 'Expert', yearsOfExp: 3 },
      { name: 'Express', level: 'Advanced', yearsOfExp: 3 },
      { name: 'PostgreSQL', level: 'Advanced', yearsOfExp: 2 },
      { name: 'Docker', level: 'Intermediate', yearsOfExp: 1 },
      { name: 'Python', level: 'Intermediate', yearsOfExp: 2 },
      { name: 'Redis', level: 'Intermediate', yearsOfExp: 1 },
    ],
    lookingForSkills: ['React', 'Machine Learning', 'Flutter'],
    interests: ['Hackathons', 'Gaming', 'Movies', 'Open Source', 'Cloud'],
    connectionGoals: ['Find hackathon teammates', 'Networking', 'Find project partners'],
    hackathonInterests: ['Distributed Systems', 'Smart Healthcare', 'FinTech'],
    experience: ['Backend Contributor to Hasura Community Tools'],
    certifications: ['Postman API Student Expert', 'Oracle Certified Database Associate'],
    linkedinUrl: 'https://linkedin.com/in/aditya-kulkarni-db',
    githubUrl: 'https://github.com/aditya-backend',
    privacy: {
      profileVisibility: 'public',
      showLocation: true,
      showResume: true,
      showSocialLinks: true,
      allowRequestsFrom: 'everyone',
    },
    isOnline: false,
    lastActive: '2h ago',
    role: 'student',
  },
  {
    id: 'user-4',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@pes.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    bio: 'Mobile dev & Flutter enthusiast. Building fluid cross-platform apps with 60 FPS animations.',
    city: 'Bangalore',
    approxLocation: { lat: 12.9352, lng: 77.5358, area: 'Banashankari' },
    education: {
      college: 'PES University',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      year: 2,
      semester: 4,
      cgpa: 8.5,
    },
    skills: [
      { name: 'Flutter', level: 'Expert', yearsOfExp: 2 },
      { name: 'Dart', level: 'Advanced', yearsOfExp: 2 },
      { name: 'Firebase', level: 'Advanced', yearsOfExp: 2 },
      { name: 'React Native', level: 'Intermediate', yearsOfExp: 1 },
      { name: 'UI/UX', level: 'Intermediate', yearsOfExp: 1 },
    ],
    lookingForSkills: ['Backend Development', 'Machine Learning', 'FastAPI'],
    interests: ['Mobile Dev', 'Gaming', 'Music', 'Sports', 'Hackathons'],
    connectionGoals: ['Find project partners', 'Make friends', 'Find study partners'],
    hackathonInterests: ['EdTech Mobile', 'Campus Life Apps'],
    linkedinUrl: 'https://linkedin.com/in/rohan-flutter',
    githubUrl: 'https://github.com/rohan-mobile',
    privacy: {
      profileVisibility: 'public',
      showLocation: true,
      showResume: true,
      showSocialLinks: true,
      allowRequestsFrom: 'everyone',
    },
    isOnline: true,
    lastActive: 'Just now',
    role: 'student',
  },
  {
    id: 'user-5',
    name: 'Ananya Sharma',
    email: 'ananya.s@rvce.edu.in',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
    bio: 'AI & Data Science sophomore at RVCE. Research focus on computer vision for precision agriculture.',
    city: 'Bangalore',
    approxLocation: { lat: 12.9238, lng: 77.4988, area: 'Mysore Road' },
    education: {
      college: 'RV College of Engineering (RVCE)',
      degree: 'B.E.',
      branch: 'AI & Data Science',
      year: 2,
      semester: 4,
      cgpa: 9.4,
    },
    skills: [
      { name: 'Python', level: 'Expert', yearsOfExp: 2 },
      { name: 'Machine Learning', level: 'Advanced', yearsOfExp: 2 },
      { name: 'TensorFlow', level: 'Advanced', yearsOfExp: 2 },
      { name: 'Computer Vision', level: 'Advanced', yearsOfExp: 2 },
      { name: 'Pandas', level: 'Advanced', yearsOfExp: 2 },
      { name: 'OpenCV', level: 'Intermediate', yearsOfExp: 1 },
    ],
    lookingForSkills: ['React', 'Backend Development', 'Docker', 'AWS'],
    interests: ['AI', 'Data Science', 'Reading', 'Travel', 'Hackathons', 'Photography'],
    connectionGoals: ['Find study partners', 'Find hackathon teammates', 'Find mentors'],
    hackathonInterests: ['AgriTech AI', 'Sustainability'],
    linkedinUrl: 'https://linkedin.com/in/ananya-ai-rvce',
    githubUrl: 'https://github.com/ananya-vision',
    privacy: {
      profileVisibility: 'public',
      showLocation: true,
      showResume: true,
      showSocialLinks: true,
      allowRequestsFrom: 'everyone',
    },
    isOnline: false,
    lastActive: '1d ago',
    role: 'student',
  },
  {
    id: 'user-6',
    name: 'Karthik Menon',
    email: 'karthik.m@bmsce.ac.in',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&auto=format&fit=crop&q=80',
    bio: 'Cybersecurity explorer, CTF player, and cloud infrastructure lover. Let us make software unhackable!',
    city: 'Bangalore',
    approxLocation: { lat: 12.9416, lng: 77.5658, area: 'Basavanagudi' },
    education: {
      college: 'BMS College of Engineering',
      degree: 'B.E.',
      branch: 'Information Science & Engineering',
      year: 4,
      semester: 8,
      cgpa: 8.7,
    },
    skills: [
      { name: 'Cybersecurity', level: 'Advanced', yearsOfExp: 3 },
      { name: 'Linux', level: 'Expert', yearsOfExp: 4 },
      { name: 'Docker', level: 'Advanced', yearsOfExp: 2 },
      { name: 'Python', level: 'Advanced', yearsOfExp: 3 },
      { name: 'Network Security', level: 'Advanced', yearsOfExp: 2 },
      { name: 'AWS', level: 'Intermediate', yearsOfExp: 2 },
    ],
    lookingForSkills: ['React', 'FastAPI', 'UI/UX'],
    interests: ['Cybersecurity', 'Gaming', 'Open Source', 'Hackathons', 'Music'],
    connectionGoals: ['Find hackathon teammates', 'Networking', 'Learn new skills'],
    hackathonInterests: ['Web3 Security', 'Defensive AI'],
    privacy: {
      profileVisibility: 'public',
      showLocation: true,
      showResume: true,
      showSocialLinks: true,
      allowRequestsFrom: 'everyone',
    },
    isOnline: true,
    lastActive: '10m ago',
    role: 'student',
  },
  {
    id: 'user-7',
    name: 'Meera Iyer',
    email: 'meera.iyer@nie.ac.in',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
    bio: 'Product Designer & UI/UX wizard at NIE. Obsessed with design tokens, accessibility, and micro-interactions.',
    city: 'Mysuru',
    approxLocation: { lat: 12.3020, lng: 76.6410, area: 'Saraswathipuram' },
    education: {
      college: 'National Institute of Engineering (NIE)',
      degree: 'B.E.',
      branch: 'Computer Science & Engineering',
      year: 3,
      semester: 6,
      cgpa: 9.3,
    },
    skills: [
      { name: 'UI/UX', level: 'Expert', yearsOfExp: 3 },
      { name: 'Figma', level: 'Expert', yearsOfExp: 3 },
      { name: 'Product Design', level: 'Advanced', yearsOfExp: 2 },
      { name: 'User Research', level: 'Advanced', yearsOfExp: 2 },
      { name: 'React', level: 'Intermediate', yearsOfExp: 1 },
      { name: 'Tailwind CSS', level: 'Advanced', yearsOfExp: 2 },
    ],
    lookingForSkills: ['Machine Learning', 'Backend Development', 'Python'],
    interests: ['Design', 'Movies', 'Music', 'Photography', 'Travel', 'Art'],
    connectionGoals: ['Find hackathon teammates', 'Make friends', 'Find project partners'],
    hackathonInterests: ['Smart Healthcare', 'Inclusive Tech', 'EdTech'],
    experience: ['Design Lead at HackNIE 2024', 'Freelance UX Consultant for 3 Startups'],
    linkedinUrl: 'https://linkedin.com/in/meera-design',
    portfolioUrl: 'https://meera.design',
    privacy: {
      profileVisibility: 'public',
      showLocation: true,
      showResume: true,
      showSocialLinks: true,
      allowRequestsFrom: 'everyone',
    },
    isOnline: true,
    lastActive: 'Just now',
    role: 'student',
  },
  {
    id: 'user-8',
    name: 'Vikram Joshi',
    email: 'vikram.j@coep.ac.in',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
    bio: 'Systems programmer & Embedded C++ developer. Robotics and autonomous vehicles enthusiast.',
    city: 'Pune',
    approxLocation: { lat: 18.5204, lng: 73.8567, area: 'Shivajinagar' },
    education: {
      college: 'COEP Technological University',
      degree: 'B.Tech',
      branch: 'Electronics & Communication',
      year: 4,
      semester: 7,
      cgpa: 8.6,
    },
    skills: [
      { name: 'C++', level: 'Expert', yearsOfExp: 4 },
      { name: 'Python', level: 'Advanced', yearsOfExp: 3 },
      { name: 'ROS', level: 'Intermediate', yearsOfExp: 2 },
      { name: 'Embedded Systems', level: 'Advanced', yearsOfExp: 3 },
      { name: 'Linux', level: 'Advanced', yearsOfExp: 3 },
    ],
    lookingForSkills: ['Computer Vision', 'PyTorch', 'UI/UX'],
    interests: ['Robotics', 'Sports', 'Gaming', 'Technology', 'Travel'],
    connectionGoals: ['Find project partners', 'Find hackathon teammates'],
    hackathonInterests: ['Autonomous Robotics', 'IoT Solutions'],
    privacy: {
      profileVisibility: 'public',
      showLocation: true,
      showResume: true,
      showSocialLinks: true,
      allowRequestsFrom: 'everyone',
    },
    isOnline: false,
    lastActive: '3d ago',
    role: 'student',
  },
  {
    id: 'admin-1',
    name: 'CampusConnect Admin',
    email: 'admin@campusconnect.ai',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80',
    bio: 'System Administrator and Student Community Moderator for CampusConnect AI.',
    city: 'Mysuru',
    education: {
      college: 'CampusConnect AI Foundation',
      degree: 'M.Tech',
      branch: 'Information Technology',
      year: 4,
    },
    skills: [
      { name: 'System Administration', level: 'Expert' },
      { name: 'Moderation', level: 'Expert' },
    ],
    interests: ['Community Building', 'AI Safety', 'Education'],
    connectionGoals: ['Mentorship'],
    privacy: {
      profileVisibility: 'public',
      showLocation: true,
      showResume: false,
      showSocialLinks: true,
      allowRequestsFrom: 'everyone',
    },
    role: 'admin',
    isOnline: true,
  }
];

export const INITIAL_CONNECTIONS: Connection[] = [
  {
    id: 'conn-1',
    requesterId: 'user-1',
    receiverId: 'user-2', // Sneha Rao
    status: 'ACCEPTED',
    createdAt: '2026-09-28T10:00:00Z',
  },
  {
    id: 'conn-2',
    requesterId: 'user-3', // Aditya Kulkarni
    receiverId: 'user-1',
    status: 'PENDING',
    createdAt: '2026-10-01T14:30:00Z',
  },
  {
    id: 'conn-3',
    requesterId: 'user-7', // Meera Iyer
    receiverId: 'user-1',
    status: 'ACCEPTED',
    createdAt: '2026-09-29T16:00:00Z',
  },
  {
    id: 'conn-4',
    requesterId: 'user-1',
    receiverId: 'user-4', // Rohan Deshmukh
    status: 'PENDING',
    createdAt: '2026-10-01T18:20:00Z',
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    senderId: 'user-2', // Sneha
    receiverId: 'user-1', // Pratheeksha
    text: 'Hey Pratheeksha! Saw your project on MedVision AI — the architecture looks super clean!',
    timestamp: '2026-09-29T11:00:00Z',
    read: true,
  },
  {
    id: 'msg-2',
    senderId: 'user-1',
    receiverId: 'user-2',
    text: 'Thanks Sneha! Loved your design system and Figma portfolio. Are you participating in the upcoming State Hackathon?',
    timestamp: '2026-09-29T11:05:00Z',
    read: true,
  },
  {
    id: 'msg-3',
    senderId: 'user-2',
    receiverId: 'user-1',
    text: 'Yes definitely! I was actually looking for an AI/ML teammate so we can pitch a healthcare solution together.',
    timestamp: '2026-09-29T11:07:00Z',
    read: true,
  },
  {
    id: 'msg-4',
    senderId: 'user-7', // Meera
    receiverId: 'user-1',
    text: 'Hi Pratheeksha! Would love to collaborate on the UI/UX for any AI models you are building.',
    timestamp: '2026-09-30T15:20:00Z',
    read: true,
  }
];

export const INITIAL_PROJECTS: UserProject[] = [
  {
    id: 'proj-1',
    title: 'MedVision AI — Clinical Assistant',
    description: 'Deep Learning pipeline for chest X-ray disease localization with heatmaps and clinical report summarization.',
    technologies: ['Python', 'PyTorch', 'FastAPI', 'OpenCV'],
    role: 'ML Engineer',
    status: 'In Progress',
    githubUrl: 'https://github.com/pratheeksha-ai/medvision-ai',
    demoUrl: 'https://medvision-demo.app',
  },
  {
    id: 'proj-2',
    title: 'PulseUI — Student Design System',
    description: 'Accessible, component-driven design library for student hackathons built with React and Tailwind CSS.',
    technologies: ['React', 'Tailwind CSS', 'Figma', 'TypeScript'],
    role: 'Lead Designer',
    status: 'Completed',
    githubUrl: 'https://github.com/snehar-frontend/pulse-ui',
  },
  {
    id: 'proj-3',
    title: 'CampusShare — Book & Gadget Exchange',
    description: 'Peer-to-peer marketplace for verified university students to loan laboratory equipment and textbooks.',
    technologies: ['Node.js', 'PostgreSQL', 'Docker', 'Redis'],
    role: 'Backend Architect',
    status: 'In Progress',
    githubUrl: 'https://github.com/aditya-backend/campus-share',
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'BioSynapse Innovators',
    description: 'Building an AI diagnostic assistive app for primary rural healthcare clinics.',
    creatorId: 'user-1',
    requiredSkills: ['Python', 'Machine Learning', 'React', 'Backend Development', 'UI/UX'],
    targetSize: 4,
    type: 'Hackathon',
    status: 'Recruiting',
    createdAt: '2026-09-30T09:00:00Z',
    compatibilityScore: 94,
    members: [
      {
        userId: 'user-1',
        user: INITIAL_STUDENTS[0],
        role: 'AI / ML Lead',
        assignedSkills: ['Python', 'Machine Learning', 'PyTorch'],
        joinedAt: '2026-09-30T09:00:00Z',
      },
      {
        userId: 'user-2',
        user: INITIAL_STUDENTS[1],
        role: 'Frontend Architect',
        assignedSkills: ['React', 'Next.js', 'Tailwind CSS'],
        joinedAt: '2026-09-30T10:30:00Z',
      },
      {
        userId: 'user-7',
        user: INITIAL_STUDENTS[6],
        role: 'UI/UX & Product Design',
        assignedSkills: ['UI/UX', 'Figma'],
        joinedAt: '2026-09-30T11:15:00Z',
      }
    ],
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'CONNECTION_REQUEST',
    title: 'New Connection Request',
    description: 'Aditya Kulkarni (SJCE Mysuru, Backend Architect) wants to connect with you.',
    relatedUserId: 'user-3',
    timestamp: '2026-10-01T14:30:00Z',
    read: false,
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'MATCH_ALERT',
    title: 'High AI Compatibility Match!',
    description: 'Sneha Rao is a 94% match with you for your Hackathon goals.',
    relatedUserId: 'user-2',
    timestamp: '2026-09-29T08:00:00Z',
    read: true,
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'CONNECTION_ACCEPTED',
    title: 'Connection Accepted',
    description: 'Meera Iyer accepted your connection request. Say hello!',
    relatedUserId: 'user-7',
    timestamp: '2026-09-29T16:00:00Z',
    read: true,
  }
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-1',
    reporterId: 'user-2',
    reportedUserId: 'user-8',
    reason: 'Suspicious profile description',
    details: 'Spam promotion of commercial course in project links.',
    createdAt: '2026-09-27T12:00:00Z',
    status: 'PENDING',
  }
];

// Storage Helper
class StorageService {
  private users: User[] = [];
  private connections: Connection[] = [];
  private messages: Message[] = [];
  private teams: Team[] = [];
  private projects: UserProject[] = [];
  private notifications: NotificationItem[] = [];
  private reports: Report[] = [];
  private currentUserId: string | null = null;
  private weights: MatchingWeights = DEFAULT_WEIGHTS;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedUsers = localStorage.getItem('cc_users');
      this.users = storedUsers ? JSON.parse(storedUsers) : [...INITIAL_STUDENTS];

      const storedConns = localStorage.getItem('cc_connections');
      this.connections = storedConns ? JSON.parse(storedConns) : [...INITIAL_CONNECTIONS];

      const storedMsgs = localStorage.getItem('cc_messages');
      this.messages = storedMsgs ? JSON.parse(storedMsgs) : [...INITIAL_MESSAGES];

      const storedTeams = localStorage.getItem('cc_teams');
      this.teams = storedTeams ? JSON.parse(storedTeams) : [...INITIAL_TEAMS];

      const storedProjs = localStorage.getItem('cc_projects');
      this.projects = storedProjs ? JSON.parse(storedProjs) : [...INITIAL_PROJECTS];

      const storedNotifs = localStorage.getItem('cc_notifications');
      this.notifications = storedNotifs ? JSON.parse(storedNotifs) : [...INITIAL_NOTIFICATIONS];

      const storedReports = localStorage.getItem('cc_reports');
      this.reports = storedReports ? JSON.parse(storedReports) : [...INITIAL_REPORTS];

      const storedUserId = localStorage.getItem('cc_current_user_id');
      if (storedUserId && this.users.some(u => u.id === storedUserId)) {
        this.currentUserId = storedUserId;
      } else {
        this.currentUserId = null;
      }

      const storedWeights = localStorage.getItem('cc_matching_weights');
      if (storedWeights) {
        this.weights = JSON.parse(storedWeights);
      }
    } catch {
      this.users = [...INITIAL_STUDENTS];
      this.connections = [...INITIAL_CONNECTIONS];
      this.messages = [...INITIAL_MESSAGES];
      this.teams = [...INITIAL_TEAMS];
      this.projects = [...INITIAL_PROJECTS];
      this.notifications = [...INITIAL_NOTIFICATIONS];
      this.reports = [...INITIAL_REPORTS];
      this.currentUserId = null;
    }
  }

  private save() {
    try {
      localStorage.setItem('cc_users', JSON.stringify(this.users));
      localStorage.setItem('cc_connections', JSON.stringify(this.connections));
      localStorage.setItem('cc_messages', JSON.stringify(this.messages));
      localStorage.setItem('cc_teams', JSON.stringify(this.teams));
      localStorage.setItem('cc_projects', JSON.stringify(this.projects));
      localStorage.setItem('cc_notifications', JSON.stringify(this.notifications));
      localStorage.setItem('cc_reports', JSON.stringify(this.reports));
      if (this.currentUserId) {
        localStorage.setItem('cc_current_user_id', this.currentUserId);
      } else {
        localStorage.removeItem('cc_current_user_id');
      }
      localStorage.setItem('cc_matching_weights', JSON.stringify(this.weights));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  // Auth & Session
  isAuthenticated(): boolean {
    return !!this.currentUserId && this.users.some(u => u.id === this.currentUserId);
  }

  getCurrentUser(): User {
    if (this.currentUserId) {
      const found = this.users.find(u => u.id === this.currentUserId);
      if (found) return found;
    }
    return this.users[0];
  }

  setCurrentUser(userId: string): User | null {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.currentUserId = userId;
      this.save();
      return user;
    }
    return null;
  }

  logout(): void {
    this.currentUserId = null;
    localStorage.removeItem('cc_current_user_id');
  }

  getAllUsers(): User[] {
    return [...this.users];
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  registerUser(userData: Partial<User>): User {
    const newId = `user-${Date.now()}`;
    const newUser: User = {
      id: newId,
      name: userData.name || 'New Student',
      email: userData.email || `student_${Date.now()}@example.edu`,
      city: userData.city || 'Mysuru',
      education: userData.education || {
        college: 'Engineering College',
        degree: 'B.E.',
        branch: 'Computer Science & Engineering',
        year: 2,
      },
      skills: userData.skills || [
        { name: 'Python', level: 'Intermediate', yearsOfExp: 1 },
        { name: 'JavaScript', level: 'Beginner', yearsOfExp: 1 },
      ],
      interests: userData.interests || ['AI', 'Hackathons', 'Gaming'],
      connectionGoals: userData.connectionGoals || ['Find hackathon teammates', 'Make friends'],
      privacy: {
        profileVisibility: 'public',
        showLocation: true,
        showResume: true,
        showSocialLinks: true,
        allowRequestsFrom: 'everyone',
      },
      role: 'student',
      isOnline: true,
      lastActive: 'Just now',
      ...userData,
    };
    this.users.push(newUser);
    this.currentUserId = newId;
    this.save();
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updates };
      this.save();
      return this.users[idx];
    }
    throw new Error('User not found');
  }

  // Connections
  getConnections(userId: string): Connection[] {
    return this.connections.filter(c => c.requesterId === userId || c.receiverId === userId);
  }

  getConnectionStatus(userA: string, userB: string): 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'ACCEPTED' | 'BLOCKED' {
    const conn = this.connections.find(
      c => (c.requesterId === userA && c.receiverId === userB) ||
           (c.requesterId === userB && c.receiverId === userA)
    );
    if (!conn) return 'NONE';
    if (conn.status === 'BLOCKED') return 'BLOCKED';
    if (conn.status === 'ACCEPTED') return 'ACCEPTED';
    if (conn.requesterId === userA) return 'PENDING_SENT';
    return 'PENDING_RECEIVED';
  }

  sendConnectionRequest(fromUserId: string, toUserId: string): Connection {
    const existing = this.connections.find(
      c => (c.requesterId === fromUserId && c.receiverId === toUserId) ||
           (c.requesterId === toUserId && c.receiverId === fromUserId)
    );
    if (existing) {
      if (existing.status === 'PENDING') return existing;
      existing.status = 'PENDING';
      existing.requesterId = fromUserId;
      existing.receiverId = toUserId;
      this.save();
      return existing;
    }
    const newConn: Connection = {
      id: `conn-${Date.now()}`,
      requesterId: fromUserId,
      receiverId: toUserId,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.connections.push(newConn);

    // Create Notification
    const sender = this.getUserById(fromUserId);
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: toUserId,
      type: 'CONNECTION_REQUEST',
      title: 'New Connection Request',
      description: `${sender?.name || 'A student'} wants to connect with you on CampusConnect.`,
      relatedUserId: fromUserId,
      timestamp: new Date().toISOString(),
      read: false,
    });

    this.save();
    return newConn;
  }

  acceptConnection(requesterId: string, currentUserId: string): Connection | null {
    const conn = this.connections.find(
      c => c.requesterId === requesterId && c.receiverId === currentUserId && c.status === 'PENDING'
    );
    if (conn) {
      conn.status = 'ACCEPTED';
      conn.updatedAt = new Date().toISOString();

      // Notify requester
      const accepter = this.getUserById(currentUserId);
      this.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: requesterId,
        type: 'CONNECTION_ACCEPTED',
        title: 'Connection Accepted',
        description: `${accepter?.name || 'A student'} accepted your connection request. Start a conversation!`,
        relatedUserId: currentUserId,
        timestamp: new Date().toISOString(),
        read: false,
      });

      this.save();
      return conn;
    }
    return null;
  }

  rejectConnection(requesterId: string, currentUserId: string): boolean {
    const idx = this.connections.findIndex(
      c => c.requesterId === requesterId && c.receiverId === currentUserId && c.status === 'PENDING'
    );
    if (idx !== -1) {
      this.connections.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  removeConnection(userA: string, userB: string): boolean {
    const idx = this.connections.findIndex(
      c => (c.requesterId === userA && c.receiverId === userB) ||
           (c.requesterId === userB && c.receiverId === userA)
    );
    if (idx !== -1) {
      this.connections.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  blockUser(currentUserId: string, targetUserId: string): boolean {
    this.removeConnection(currentUserId, targetUserId);
    this.connections.push({
      id: `block-${Date.now()}`,
      requesterId: currentUserId,
      receiverId: targetUserId,
      status: 'BLOCKED',
      createdAt: new Date().toISOString(),
    });
    this.save();
    return true;
  }

  // Messaging
  getConversation(userA: string, userB: string): Message[] {
    return this.messages.filter(
      m => (m.senderId === userA && m.receiverId === userB) ||
           (m.senderId === userB && m.receiverId === userA)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  getTeamMessages(teamId: string): Message[] {
    return this.messages.filter(m => m.teamId === teamId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  sendMessage(senderId: string, receiverId: string | undefined, text: string, teamId?: string): Message {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId,
      receiverId,
      teamId,
      text,
      timestamp: new Date().toISOString(),
      read: false,
    };
    this.messages.push(newMsg);
    this.save();
    return newMsg;
  }

  markMessagesRead(userA: string, userB: string) {
    let changed = false;
    this.messages.forEach(m => {
      if (m.senderId === userB && m.receiverId === userA && !m.read) {
        m.read = true;
        changed = true;
      }
    });
    if (changed) this.save();
  }

  // Teams
  getTeams(): Team[] {
    return [...this.teams];
  }

  createTeam(teamData: Omit<Team, 'id' | 'createdAt'>): Team {
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.teams.unshift(newTeam);
    this.save();
    return newTeam;
  }

  addTeamMember(teamId: string, member: User, role: string, assignedSkills: string[]): Team | null {
    const team = this.teams.find(t => t.id === teamId);
    if (team) {
      if (!team.members.some(m => m.userId === member.id)) {
        team.members.push({
          userId: member.id,
          user: member,
          role,
          assignedSkills,
          joinedAt: new Date().toISOString(),
        });
        if (team.members.length >= team.targetSize) {
          team.status = 'Full';
        }
        this.save();
      }
      return team;
    }
    return null;
  }

  // Projects
  getProjects(): UserProject[] {
    return [...this.projects];
  }

  addProject(projectData: Omit<UserProject, 'id'>): UserProject {
    const newProj: UserProject = {
      ...projectData,
      id: `proj-${Date.now()}`,
    };
    this.projects.unshift(newProj);
    this.save();
    return newProj;
  }

  // Notifications
  getNotifications(userId: string): NotificationItem[] {
    return this.notifications.filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  markNotificationRead(notifId: string) {
    const n = this.notifications.find(item => item.id === notifId);
    if (n) {
      n.read = true;
      this.save();
    }
  }

  // Reports
  getReports(): Report[] {
    return [...this.reports];
  }

  createReport(reporterId: string, reportedUserId: string, reason: string, details: string): Report {
    const rep: Report = {
      id: `rep-${Date.now()}`,
      reporterId,
      reportedUserId,
      reason,
      details,
      createdAt: new Date().toISOString(),
      status: 'PENDING',
    };
    this.reports.unshift(rep);
    this.save();
    return rep;
  }

  resolveReport(reportId: string, action: 'DISMISSED' | 'SUSPEND'): void {
    const rep = this.reports.find(r => r.id === reportId);
    if (rep) {
      rep.status = 'RESOLVED';
      if (action === 'SUSPEND') {
        const u = this.getUserById(rep.reportedUserId);
        if (u) u.isSuspended = true;
      }
      this.save();
    }
  }

  // Weights
  getWeights(): MatchingWeights {
    return { ...this.weights };
  }

  setWeights(newWeights: MatchingWeights) {
    this.weights = { ...newWeights };
    this.save();
  }

  // Reset to initial demo data
  resetDatabase() {
    localStorage.clear();
    this.users = [...INITIAL_STUDENTS];
    this.connections = [...INITIAL_CONNECTIONS];
    this.messages = [...INITIAL_MESSAGES];
    this.teams = [...INITIAL_TEAMS];
    this.projects = [...INITIAL_PROJECTS];
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.reports = [...INITIAL_REPORTS];
    this.currentUserId = 'user-1';
    this.weights = DEFAULT_WEIGHTS;
    this.save();
  }
}

export const storage = new StorageService();
