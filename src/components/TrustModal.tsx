import React from 'react';
import { X, ShieldCheck, Mail, AlertTriangle, CheckCircle2, Lock, FileCheck, EyeOff, UserX } from 'lucide-react';

interface TrustModalProps {
  onClose: () => void;
}

export const TrustModal: React.FC<TrustModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Trust, Authenticity & Scam Prevention</h2>
              <p className="text-xs text-slate-400">How CampusConnect AI ensures only genuine college students collaborate</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs text-slate-300 leading-relaxed">
          {/* Important Clarity Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Current Demo vs. Live Production Network</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-200/90">
              In this preview environment, the profiles you see (Sneha Rao, Aditya Kulkarni, Meera Iyer, etc.) are <strong>pre-seeded demonstration profiles</strong> so you can test hackathon team formation, matching scores, and real-time chat without waiting for external sign-ups. When deployed to your college, only <strong>real, verified classmates</strong> can join.
            </p>
          </div>

          {/* 5 Pillars of Scam Prevention */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              5 Pillars to Guarantee Real Students & Prevent Scams
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">1. Mandatory College Domain Email Verification</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Anonymous or fake accounts are barred. Students must authenticate using their official institutional email (e.g., <code>@nie.ac.in</code>, <code>@sjce.ac.in</code>, <code>@rvce.edu.in</code>) with single-use OTP validation.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">2. Physical Student ID & Roll Number Audit</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    College administrators and automated OCR cross-reference University Seat Numbers (USNs) to ensure every profile corresponds to an active enrolled undergraduate or postgraduate.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">3. Zero Financial or Commercial Transactions</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    CampusConnect AI is strictly an academic, open-source, and hackathon project platform. There is no money transfer, cryptocurrency, or paid freelance solicitation permitted, completely eliminating financial scams.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                  <EyeOff className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">4. Strict Geographic Privacy (No Exact Addresses)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    The platform never exposes physical room numbers, exact addresses, or live GPS telemetry. Only approximate city and campus proximity are calculated for study group meetups.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                  <UserX className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">5. One-Click Block & Instant Incident Moderation</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Any student can instantly block unauthorized contacts. Campus moderators can audit reports and suspend malicious accounts campus-wide within seconds from the Admin Dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Callout */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
            <h4 className="font-bold text-white mb-1">Want to connect with your actual classmates today?</h4>
            <p className="text-slate-400 text-[11px] mb-3">
              You can invite your friends to this app. When they register their real names and upload their resumes, they can discover you, join your hackathon teams, and review your compatibility scores.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                App URL: {window.location.origin}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer transition shadow-lg shadow-emerald-600/20"
          >
            I Understand — Keep Community Safe
          </button>
        </div>
      </div>
    </div>
  );
};
