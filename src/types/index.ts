export type MatchingMode = 'FRIEND_MATCH' | 'SKILL_MATCH' | 'TEAM_MATCH';

export interface UserSkill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExp?: number;
}

export interface UserProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  role: string;
  status: 'Idea' | 'In Progress' | 'Completed';
  githubUrl?: string;
  demoUrl?: string;
}

export interface UserEducation {
  college: string;
  degree: string;
  branch: string;
  year: number; // 1, 2, 3, 4
  semester?: number;
  cgpa?: number;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'college_only' | 'connections_only';
  showLocation: boolean;
  showResume: boolean;
  showSocialLinks: boolean;
  allowRequestsFrom: 'everyone' | 'same_college';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  city: string;
  approxLocation?: {
    lat: number;
    lng: number;
    area: string;
  };
  education: UserEducation;
  skills: UserSkill[];
  interests: string[]; // e.g. ["AI", "Gaming", "Photography", "Hackathons"]
  connectionGoals: string[]; // e.g. ["Find hackathon teammates", "Make friends", "Project partners"]
  experience?: string[];
  certifications?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  lookingForSkills?: string[];
  hackathonInterests?: string[];
  privacy: PrivacySettings;
  resumeUrl?: string;
  resumeExtracted?: boolean;
  isOnline?: boolean;
  lastActive?: string;
  role?: 'student' | 'admin';
  isSuspended?: boolean;
}

export interface MatchFactors {
  skillsScore: number;
  interestsScore: number;
  projectGoalsScore: number;
  locationScore: number;
  educationScore: number;
  hackathonScore: number;
  careerGoalsScore: number;
  yearScore: number;
}

export interface MatchResult {
  userId: string;
  user: User;
  overallScore: number;
  factors: MatchFactors;
  commonSkills: string[];
  commonInterests: string[];
  complementarySkills: {
    youProvide: string[];
    theyProvide: string[];
  };
  differences: string[];
  matchSummary: string;
  detailedReasons: string[];
  mode: MatchingMode;
}

export type ConnectionStatus = 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';

export interface Connection {
  id: string;
  requesterId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';
  createdAt: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string;
  teamId?: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface TeamMember {
  userId: string;
  user: User;
  role: string;
  assignedSkills: string[];
  joinedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  requiredSkills: string[];
  targetSize: number;
  members: TeamMember[];
  type: 'Hackathon' | 'Capstone Project' | 'Startup Idea' | 'Study Group';
  status: 'Recruiting' | 'Full' | 'In Progress' | 'Finished';
  createdAt: string;
  compatibilityScore?: number;
}

export interface TeamMatchRecommendation {
  teamCompatibilityScore: number;
  recommendedMembers: {
    user: User;
    suggestedRole: string;
    coveredSkills: string[];
    matchScore: number;
  }[];
  allCoveredSkills: string[];
  missingSkills: string[];
  teamSynergySummary: string;
}

export interface ExtractedResumeData {
  name: string;
  email?: string;
  college?: string;
  degree?: string;
  branch?: string;
  year?: number;
  skills: string[];
  projects: {
    title: string;
    description: string;
    tech: string[];
  }[];
  certifications: string[];
  experience: string[];
  summary?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'CONNECTION_REQUEST' | 'CONNECTION_ACCEPTED' | 'NEW_MESSAGE' | 'TEAM_INVITE' | 'MATCH_ALERT';
  title: string;
  description: string;
  relatedUserId?: string;
  relatedTeamId?: string;
  timestamp: string;
  read: boolean;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  details: string;
  createdAt: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
}

export interface MatchingWeights {
  skills: number;          // Default: 0.25
  interests: number;       // Default: 0.15
  projectGoals: number;    // Default: 0.15
  location: number;        // Default: 0.10
  educationBranch: number; // Default: 0.10
  hackathon: number;       // Default: 0.10
  careerGoals: number;     // Default: 0.10
  year: number;            // Default: 0.05
}

export interface AppointmentBooking {
  id?: string;
  created_at?: string;
  full_name: string;
  email: string;
  phone?: string;
  student_college?: string;
  mentor_name: string;
  session_type: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
  status?: string;
}

