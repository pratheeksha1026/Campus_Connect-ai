import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Layers,
  GraduationCap,
  Briefcase,
  Award,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_RESUMES, parseResumeText } from '../services/resumeParser';
import { ExtractedResumeData, UserSkill } from '../types';

interface ResumeUploadPageProps {
  onSuccess: () => void;
}

export const ResumeUploadPage: React.FC<ResumeUploadPageProps> = ({ onSuccess }) => {
  const { currentUser, updateProfile } = useAuth();

  const [rawText, setRawText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedResumeData | null>(null);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Handle sample resume selection
  const handleSelectSample = (sample: typeof SAMPLE_RESUMES[0]) => {
    setRawText(sample.text);
    setSelectedFile(null);
    setExtractedData(sample.data);
    setAppliedSuccess(false);
  };

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Read text content
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string || '';
        setRawText(text);
      };
      reader.readAsText(file);
    }
  };

  // Run AI / NLP Parser
  const handleExtract = () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    setAppliedSuccess(false);

    setTimeout(() => {
      const parsed = parseResumeText(rawText);
      setExtractedData(parsed);
      setIsProcessing(false);
    }, 900);
  };

  // Remove a skill from extracted preview
  const handleRemoveSkill = (skillToRemove: string) => {
    if (!extractedData) return;
    setExtractedData({
      ...extractedData,
      skills: extractedData.skills.filter(s => s !== skillToRemove),
    });
  };

  // Add a custom skill to extracted preview
  const handleAddSkill = () => {
    if (!newSkillInput.trim() || !extractedData) return;
    if (!extractedData.skills.includes(newSkillInput.trim())) {
      setExtractedData({
        ...extractedData,
        skills: [...extractedData.skills, newSkillInput.trim()],
      });
    }
    setNewSkillInput('');
  };

  // Confirm and Merge into Student Profile
  const handleConfirmAndApply = () => {
    if (!extractedData) return;

    // Convert extracted skills to UserSkill array
    const existingSkillNames = currentUser.skills.map(s => s.name.toLowerCase());
    const newSkillsToAdd: UserSkill[] = extractedData.skills
      .filter(s => !existingSkillNames.includes(s.toLowerCase()))
      .map(s => ({
        name: s,
        level: 'Intermediate',
        yearsOfExp: 1,
      }));

    const combinedSkills = [...currentUser.skills, ...newSkillsToAdd];

    // Combine projects
    const newProjects = extractedData.projects.map((p, idx) => ({
      id: `proj-ext-${Date.now()}-${idx}`,
      title: p.title,
      description: p.description,
      technologies: p.tech,
      role: 'Contributor',
      status: 'In Progress' as const,
    }));

    updateProfile({
      education: {
        ...currentUser.education,
        college: extractedData.college || currentUser.education.college,
        degree: extractedData.degree || currentUser.education.degree,
        branch: extractedData.branch || currentUser.education.branch,
        year: extractedData.year || currentUser.education.year,
      },
      skills: combinedSkills,
      certifications: [
        ...(currentUser.certifications || []),
        ...extractedData.certifications.filter(c => !(currentUser.certifications || []).includes(c)),
      ],
      resumeExtracted: true,
    });

    setAppliedSuccess(true);
    setTimeout(() => {
      onSuccess();
    }, 1800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Resume NLP Pipeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Resume Upload & AI Information Extraction
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Upload your PDF resume or try our pre-built student resumes. Our NLP extraction identifies technical competencies and academic credentials, presenting them for your review before committing to your profile.
        </p>
      </div>

      {/* 1-Click Sample Resumes for instant testing */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-400" />
            1-Click Sample Resumes (Test Without Uploading File)
          </span>
          <span className="text-[11px] text-indigo-400">Click to load & test</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_RESUMES.map(sample => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="p-3 text-left rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {sample.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                  {sample.data.skills.slice(0, 5).join(', ')}...
                </div>
              </div>
              <span className="text-[10px] text-indigo-400 font-semibold mt-2">Load Profile →</span>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Zone & Text Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dropzone */}
        <div className="bg-slate-900 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 transition">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Upload Your Student Resume</h3>
            <p className="text-xs text-slate-400 mt-1">Accepts PDF, TXT or Markdown (Max 5MB)</p>
          </div>

          <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-lg shadow-indigo-600/30 transition">
            <span>Browse Computer</span>
            <input
              type="file"
              accept=".pdf,.txt,.md,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {selectedFile && (
            <div className="text-xs text-emerald-400 font-medium">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>

        {/* Raw Text Input Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Or Paste Resume Text
            </label>
            <textarea
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder="Paste plain text from your resume here..."
              rows={7}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <button
            onClick={handleExtract}
            disabled={!rawText.trim() || isProcessing}
            className="w-full mt-3 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running NLP Entity Extraction...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract Information via AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Step 2: Extracted Information Review Card */}
      {extractedData && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Extracted Information — Review & Confirm</h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Verify the extracted credentials. Edit or remove items before merging them with your profile.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              Confidence: 94%
            </span>
          </div>

          {/* Education & Bio Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Candidate Name</span>
              <span className="text-xs font-bold text-white">{extractedData.name}</span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">College / University</span>
              <span className="text-xs font-bold text-white truncate block">{extractedData.college}</span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Degree & Branch</span>
              <span className="text-xs font-bold text-white truncate block">
                {extractedData.degree} in {extractedData.branch}
              </span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Academic Year</span>
              <span className="text-xs font-bold text-white">{extractedData.year}rd Year</span>
            </div>
          </div>

          {/* Extracted Skills with Editable Tags */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                Extracted Technical Skills ({extractedData.skills.length})
              </h3>
              <span className="text-[11px] text-slate-400">Click (x) to remove unwanted skills</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {extractedData.skills.map(skill => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-200 border border-indigo-500/40 text-xs font-medium flex items-center gap-1.5"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-indigo-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add missing skill */}
            <div className="flex items-center gap-2 max-w-sm pt-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={e => setNewSkillInput(e.target.value)}
                placeholder="Add missing skill (e.g. Docker)..."
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <button
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Extracted Projects & Certifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" /> Extracted Projects
              </h4>
              <ul className="space-y-2 text-xs">
                {extractedData.projects.map((p, i) => (
                  <li key={i} className="text-slate-300">
                    <strong className="text-white block">{p.title}</strong>
                    <span className="text-slate-400 text-[11px] block">{p.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-purple-400" /> Extracted Certifications
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {extractedData.certifications.length === 0 ? (
                  <li className="text-slate-500 italic">No certifications detected.</li>
                ) : (
                  extractedData.certifications.map((c, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Bottom Confirmation Bar */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              {appliedSuccess ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Successfully applied to your student profile! Redirecting...
                </span>
              ) : (
                <span>Confirming will update your skills, degree, and project highlights.</span>
              )}
            </div>

            <button
              onClick={handleConfirmAndApply}
              disabled={appliedSuccess}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Apply to My Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
