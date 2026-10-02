import { User, MatchResult, MatchFactors, MatchingMode, MatchingWeights } from '../types';

export const DEFAULT_WEIGHTS: MatchingWeights = {
  skills: 0.25,
  interests: 0.15,
  projectGoals: 0.15,
  location: 0.10,
  educationBranch: 0.10,
  hackathon: 0.10,
  careerGoals: 0.10,
  year: 0.05,
};

// Semantic Skill Clusters to recognize related and complementary tech
const SKILL_CLUSTERS: Record<string, string[]> = {
  'ai_ml': ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'NLP', 'Computer Vision', 'Data Science', 'Pandas', 'NumPy', 'Predictive Modeling'],
  'frontend': ['React', 'Next.js', 'Vue', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML/CSS', 'Angular', 'Frontend Development'],
  'backend': ['Node.js', 'Express', 'FastAPI', 'Django', 'Go', 'Java', 'Spring Boot', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'REST APIs', 'Backend Development', 'GraphQL'],
  'ui_ux': ['UI/UX', 'Figma', 'Product Design', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
  'cloud_devops': ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'Linux', 'DevOps', 'Terraform'],
  'mobile': ['Flutter', 'React Native', 'Android', 'iOS', 'Swift', 'Kotlin', 'Mobile Development'],
  'security': ['Cybersecurity', 'Ethical Hacking', 'Cryptography', 'Network Security', 'Penetration Testing', 'InfoSec'],
  'blockchain': ['Solidity', 'Web3', 'Smart Contracts', 'Ethereum', 'Blockchain'],
};

// Check if two skills are semantically related
export function areSkillsRelated(s1: string, s2: string): boolean {
  const norm1 = s1.trim().toLowerCase();
  const norm2 = s2.trim().toLowerCase();
  if (norm1 === norm2) return true;
  if (norm1.includes(norm2) || norm2.includes(norm1)) return true;

  for (const cluster of Object.values(SKILL_CLUSTERS)) {
    const inCluster1 = cluster.some(c => c.toLowerCase() === norm1);
    const inCluster2 = cluster.some(c => c.toLowerCase() === norm2);
    if (inCluster1 && inCluster2) return true;
  }
  return false;
}

// Compute semantic overlap score between two skill sets
export function calculateSemanticSkillScore(skills1: string[], skills2: string[]): number {
  if (!skills1.length || !skills2.length) return 0;
  let matches = 0;
  for (const s1 of skills1) {
    for (const s2 of skills2) {
      if (areSkillsRelated(s1, s2)) {
        matches += (s1.toLowerCase() === s2.toLowerCase()) ? 1 : 0.75;
        break;
      }
    }
  }
  return Math.min(100, Math.round((matches / Math.max(skills1.length, skills2.length)) * 100));
}

// Distance approximation between two coordinate points in km (Haversine formula)
export function calculateDistanceKm(
  lat1?: number, lon1?: number,
  lat2?: number, lon2?: number
): number | null {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return null;
  }
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Main AI Matching Engine
export function calculateMatchScore(
  currentUser: User,
  targetUser: User,
  mode: MatchingMode = 'FRIEND_MATCH',
  customWeights?: MatchingWeights
): MatchResult {
  const weights = customWeights || DEFAULT_WEIGHTS;

  const currentSkillNames = currentUser.skills.map(s => s.name);
  const targetSkillNames = targetUser.skills.map(s => s.name);

  // Common exact & semantic skills
  const commonSkills = currentSkillNames.filter(cs =>
    targetSkillNames.some(ts => ts.toLowerCase() === cs.toLowerCase())
  );

  // Common interests
  const commonInterests = currentUser.interests.filter(ci =>
    targetUser.interests.some(ti => ti.toLowerCase() === ci.toLowerCase())
  );

  // Complementary skills:
  // e.g. What currentUser is looking for that targetUser has, or different skill clusters
  const targetProvides = targetSkillNames.filter(ts =>
    !currentSkillNames.some(cs => areSkillsRelated(cs, ts)) &&
    (currentUser.lookingForSkills?.some(lfs => areSkillsRelated(lfs, ts)) || true)
  );

  const youProvide = currentSkillNames.filter(cs =>
    !targetSkillNames.some(ts => areSkillsRelated(ts, cs))
  );

  // 1. Skills Factor (0-100)
  let skillsScore = 0;
  if (mode === 'SKILL_MATCH') {
    // In skill match, look for complementary skills + common ground
    const complementaryRatio = Math.min(1, targetProvides.length / Math.max(1, (currentUser.lookingForSkills?.length || 3)));
    const baseSkillScore = calculateSemanticSkillScore(currentSkillNames, targetSkillNames);
    skillsScore = Math.round(complementaryRatio * 60 + (baseSkillScore > 0 ? 40 : 20));
  } else {
    // Normal / Friend match
    const baseSkillScore = calculateSemanticSkillScore(currentSkillNames, targetSkillNames);
    skillsScore = Math.min(100, baseSkillScore + (commonSkills.length > 0 ? 20 : 0));
  }

  // 2. Interests Factor (0-100)
  const maxInterests = Math.max(currentUser.interests.length, targetUser.interests.length, 1);
  const interestsScore = Math.min(100, Math.round((commonInterests.length / maxInterests) * 100 * 1.4));

  // 3. Project / Connection Goals Factor (0-100)
  const commonGoals = currentUser.connectionGoals.filter(cg =>
    targetUser.connectionGoals.some(tg => tg.toLowerCase() === cg.toLowerCase())
  );
  const projectGoalsScore = Math.min(100, Math.round((commonGoals.length / Math.max(currentUser.connectionGoals.length, 1)) * 100));

  // 4. Location Factor (0-100)
  let locationScore = 40;
  const sameCity = currentUser.city.trim().toLowerCase() === targetUser.city.trim().toLowerCase();
  if (sameCity) {
    locationScore = 100;
  } else if (currentUser.approxLocation && targetUser.approxLocation) {
    const dist = calculateDistanceKm(
      currentUser.approxLocation.lat, currentUser.approxLocation.lng,
      targetUser.approxLocation.lat, targetUser.approxLocation.lng
    );
    if (dist !== null) {
      if (dist <= 15) locationScore = 95;
      else if (dist <= 30) locationScore = 80;
      else if (dist <= 60) locationScore = 65;
      else locationScore = 40;
    }
  }

  // 5. Education / Branch Factor (0-100)
  let educationScore = 50;
  const sameCollege = currentUser.education.college.toLowerCase() === targetUser.education.college.toLowerCase();
  const sameBranch = currentUser.education.branch.toLowerCase() === targetUser.education.branch.toLowerCase();
  if (sameCollege && sameBranch) educationScore = 100;
  else if (sameCollege) educationScore = 85;
  else if (sameBranch) educationScore = 75;
  else educationScore = 60;

  // 6. Hackathon Factor (0-100)
  let hackathonScore = 50;
  const bothHackathon =
    currentUser.connectionGoals.some(g => g.toLowerCase().includes('hackathon')) &&
    targetUser.connectionGoals.some(g => g.toLowerCase().includes('hackathon'));
  if (bothHackathon) {
    hackathonScore = 100;
  } else if (
    currentUser.interests.some(i => i.toLowerCase().includes('hackathon')) ||
    targetUser.interests.some(i => i.toLowerCase().includes('hackathon'))
  ) {
    hackathonScore = 75;
  }

  // 7. Career Goals / Looking For (0-100)
  const careerGoalsScore = Math.min(100, Math.round((commonGoals.length * 30) + 40));

  // 8. Academic Year Factor (0-100)
  const yearDiff = Math.abs(currentUser.education.year - targetUser.education.year);
  let yearScore = 100;
  if (yearDiff === 1) yearScore = 85;
  else if (yearDiff === 2) yearScore = 70;
  else if (yearDiff >= 3) yearScore = 50;

  // Compile Factor Object
  const factors: MatchFactors = {
    skillsScore: Math.min(100, Math.max(10, skillsScore)),
    interestsScore: Math.min(100, Math.max(10, interestsScore)),
    projectGoalsScore: Math.min(100, Math.max(10, projectGoalsScore)),
    locationScore: Math.min(100, Math.max(10, locationScore)),
    educationScore: Math.min(100, Math.max(10, educationScore)),
    hackathonScore: Math.min(100, Math.max(10, hackathonScore)),
    careerGoalsScore: Math.min(100, Math.max(10, careerGoalsScore)),
    yearScore: Math.min(100, Math.max(10, yearScore)),
  };

  // Adjust weights based on mode
  let effectiveWeights = { ...weights };
  if (mode === 'FRIEND_MATCH') {
    effectiveWeights = {
      skills: 0.10,
      interests: 0.35,
      projectGoals: 0.10,
      location: 0.20,
      educationBranch: 0.10,
      hackathon: 0.05,
      careerGoals: 0.05,
      year: 0.05,
    };
  } else if (mode === 'SKILL_MATCH') {
    effectiveWeights = {
      skills: 0.40,
      interests: 0.10,
      projectGoals: 0.15,
      location: 0.05,
      educationBranch: 0.05,
      hackathon: 0.15,
      careerGoals: 0.05,
      year: 0.05,
    };
  }

  // Overall Weighted Score
  const rawScore =
    factors.skillsScore * effectiveWeights.skills +
    factors.interestsScore * effectiveWeights.interests +
    factors.projectGoalsScore * effectiveWeights.projectGoals +
    factors.locationScore * effectiveWeights.location +
    factors.educationScore * effectiveWeights.educationBranch +
    factors.hackathonScore * effectiveWeights.hackathon +
    factors.careerGoalsScore * effectiveWeights.careerGoals +
    factors.yearScore * effectiveWeights.year;

  const overallScore = Math.min(99, Math.max(45, Math.round(rawScore)));

  // Generate Explainable AI Reasons
  const detailedReasons: string[] = [];
  const differences: string[] = [];

  if (sameCity) {
    detailedReasons.push(`Same city (${targetUser.city})`);
  } else if (locationScore >= 80) {
    detailedReasons.push(`Nearby location (within commuting distance)`);
  } else {
    differences.push(`Different cities (${currentUser.city} vs ${targetUser.city})`);
  }

  if (sameCollege) {
    detailedReasons.push(`Attends same institution (${targetUser.education.college})`);
  } else {
    differences.push(`Different institutions`);
  }

  if (sameBranch) {
    detailedReasons.push(`Same engineering discipline (${targetUser.education.branch})`);
  } else {
    differences.push(`Different branches (${currentUser.education.branch} & ${targetUser.education.branch})`);
  }

  if (yearDiff === 0) {
    detailedReasons.push(`Same academic year (${targetUser.education.year}th Year)`);
  } else {
    differences.push(`${yearDiff} year(s) academic difference`);
  }

  if (commonInterests.length > 0) {
    detailedReasons.push(`${commonInterests.length} shared interest(s): ${commonInterests.slice(0, 3).join(', ')}`);
  }

  if (commonSkills.length > 0) {
    detailedReasons.push(`${commonSkills.length} common skill(s): ${commonSkills.slice(0, 3).join(', ')}`);
  }

  if (targetProvides.length > 0 && youProvide.length > 0) {
    detailedReasons.push(
      `Complementary skill synergy: You offer ${youProvide.slice(0, 2).join(' & ')}, they bring ${targetProvides.slice(0, 2).join(' & ')}`
    );
  }

  if (bothHackathon) {
    detailedReasons.push(`Both actively looking for hackathon teammates`);
  }

  // Summary statement
  let matchSummary = '';
  if (overallScore >= 88) {
    matchSummary = `Exceptional compatibility across ${commonInterests.length > 0 ? 'interests' : 'goals'} and complementary technical skills.`;
  } else if (overallScore >= 75) {
    matchSummary = `Strong potential collaborator with overlapping objectives and valuable complementary experience.`;
  } else {
    matchSummary = `Moderate synergy with potential for cross-disciplinary peer learning.`;
  }

  return {
    userId: targetUser.id,
    user: targetUser,
    overallScore,
    factors,
    commonSkills,
    commonInterests,
    complementarySkills: {
      youProvide: youProvide.slice(0, 4),
      theyProvide: targetProvides.slice(0, 4),
    },
    differences,
    matchSummary,
    detailedReasons,
    mode,
  };
}
