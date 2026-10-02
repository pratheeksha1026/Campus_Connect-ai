import React from 'react';
import { Sparkles, Shield, Heart, Code2 } from 'lucide-react';

interface FooterProps {
  onOpenArchitecture: () => void;
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenArchitecture, setCurrentTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">CampusConnect AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Find Your People. Build Your Team. Create Something Together.
            </p>
            <p className="text-[11px] text-slate-500">
              Built for engineering & college students across India & worldwide.
            </p>
          </div>

          {/* Core Matching Modes */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">AI Matching Modes</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <button onClick={() => setCurrentTab('discover')} className="hover:text-indigo-400 transition cursor-pointer">
                  🎉 Friend Match (Interests & Hobbies)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('discover')} className="hover:text-indigo-400 transition cursor-pointer">
                  ⚡ Skill Match (Tech Complementarity)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('team-builder')} className="hover:text-indigo-400 transition cursor-pointer">
                  🚀 Team Match (Hackathon Formation)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('skill-gap')} className="hover:text-indigo-400 transition cursor-pointer">
                  🎯 Skill Gap Analysis & Peer Learning
                </button>
              </li>
            </ul>
          </div>

          {/* Student Tools */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Features & Privacy</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <button onClick={() => setCurrentTab('appointments')} className="text-emerald-400 font-semibold hover:text-emerald-300 transition cursor-pointer">
                  📅 Book 1-on-1 Session (Supabase DB)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('resume-upload')} className="hover:text-indigo-400 transition cursor-pointer">
                  📄 Resume AI Parser & Skill Extraction
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('chat')} className="hover:text-indigo-400 transition cursor-pointer">
                  💬 Verified Student Direct Messaging
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('projects')} className="hover:text-indigo-400 transition cursor-pointer">
                  💼 Student Project Showcase
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('settings')} className="hover:text-indigo-400 transition cursor-pointer">
                  🔒 Privacy Controls & Approximate Geo
                </button>
              </li>
            </ul>
          </div>

          {/* System & Architecture */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Architecture & Docs</h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Explore the 17-phase engineering blueprint, ER diagrams, and FastAPI / MySQL backend specs.
            </p>
            <button
              onClick={onOpenArchitecture}
              className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-600/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>View Technical Blueprint</span>
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 CampusConnect AI. Designed for high-integrity student collaboration.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-indigo-400" /> Safe, Verified Student Network
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Heart className="w-3.5 h-3.5 text-rose-400" /> By Students, For Students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
