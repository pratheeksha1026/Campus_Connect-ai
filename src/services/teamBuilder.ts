import { User, TeamMatchRecommendation } from '../types';
import { areSkillsRelated } from './aiMatching';

export function recommendTeam(
  currentUser: User,
  allCandidates: User[],
  requiredSkills: string[],
  targetSize: number = 4
): TeamMatchRecommendation {
  // Normalize candidate pool excluding current user and blocked/suspended users
  const candidates = allCandidates.filter(u => u.id !== currentUser.id && !u.isSuspended);

  // Map each candidate's suitability against required skills
  const scoredCandidates = candidates.map(cand => {
    const candSkillNames = cand.skills.map(s => s.name);
    const covered = requiredSkills.filter(req =>
      candSkillNames.some(cs => areSkillsRelated(cs, req))
    );
    // Determine primary role
    let suggestedRole = 'General Collaborator';
    if (candSkillNames.some(s => ['Figma', 'UI/UX', 'Product Design'].some(x => areSkillsRelated(s, x)))) {
      suggestedRole = 'UI/UX & Design Lead';
    } else if (candSkillNames.some(s => ['Machine Learning', 'AI', 'PyTorch', 'Data Science'].some(x => areSkillsRelated(s, x)))) {
      suggestedRole = 'Machine Learning Engineer';
    } else if (candSkillNames.some(s => ['React', 'Next.js', 'Vue', 'Frontend'].some(x => areSkillsRelated(s, x)))) {
      suggestedRole = 'Frontend Architect';
    } else if (candSkillNames.some(s => ['Node.js', 'Express', 'FastAPI', 'Django', 'SQL', 'PostgreSQL'].some(x => areSkillsRelated(s, x)))) {
      suggestedRole = 'Backend & Cloud Engineer';
    } else if (candSkillNames.some(s => ['Docker', 'AWS', 'DevOps', 'Kubernetes'].some(x => areSkillsRelated(s, x)))) {
      suggestedRole = 'DevOps / Cloud Specialist';
    }

    const hackathonBoost = cand.connectionGoals.some(g => g.toLowerCase().includes('hackathon')) ? 15 : 0;
    const matchScore = Math.min(99, Math.round((covered.length / Math.max(1, requiredSkills.length)) * 75 + hackathonBoost + 15));

    return {
      user: cand,
      suggestedRole,
      coveredSkills: covered,
      matchScore,
    };
  });

  // Sort candidates by match score
  scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);

  // Select top candidates to fulfill targetSize - 1 (since current user is member #1)
  const slotsToFill = Math.max(1, targetSize - 1);
  const selectedMembers = scoredCandidates.slice(0, slotsToFill);

  // Calculate union of covered skills including current user's skills
  const mySkillNames = currentUser.skills.map(s => s.name);
  const myCovered = requiredSkills.filter(req =>
    mySkillNames.some(cs => areSkillsRelated(cs, req))
  );

  const coveredSet = new Set<string>(myCovered);
  selectedMembers.forEach(m => {
    m.coveredSkills.forEach(s => coveredSet.add(s));
  });

  const allCoveredSkills = Array.from(coveredSet);
  const missingSkills = requiredSkills.filter(req => !allCoveredSkills.includes(req));

  // Team Synergy Score calculation
  const coverageRatio = allCoveredSkills.length / Math.max(1, requiredSkills.length);
  const avgCandidateScore = selectedMembers.length > 0
    ? selectedMembers.reduce((acc, m) => acc + m.matchScore, 0) / selectedMembers.length
    : 70;

  const teamCompatibilityScore = Math.min(98, Math.max(60, Math.round(coverageRatio * 55 + avgCandidateScore * 0.45)));

  let teamSynergySummary = '';
  if (missingSkills.length === 0) {
    teamSynergySummary = `100% skill coverage achieved! High synergy across frontend, backend, AI/ML, and interface design.`;
  } else {
    teamSynergySummary = `Strong baseline coverage (${allCoveredSkills.length}/${requiredSkills.length} core competencies). Consider external mentorship for ${missingSkills.join(', ')}.`;
  }

  return {
    teamCompatibilityScore,
    recommendedMembers: selectedMembers,
    allCoveredSkills,
    missingSkills,
    teamSynergySummary,
  };
}
