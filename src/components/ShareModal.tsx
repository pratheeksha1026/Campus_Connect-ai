import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageCircle, Send, QrCode, Sparkles, Globe } from 'lucide-react';

interface ShareModalProps {
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  // The permanent public share URL for this application
  const shareUrl = 'https://ais-pre-b2pe7nb36f4mdod7lcff5m-965545312711.asia-east1.run.app';

  const shareText = `Hey! Join me on CampusConnect AI — our student networking & hackathon team builder platform. Register your college & skills here: ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Join CampusConnect AI with your college peers!')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Share App with Classmates</h2>
              <p className="text-xs text-slate-400">Invite peers from your college or any campus</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          {/* Link Box with 1-Click Copy */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Public Live App Link (Send this to anyone)</span>
            </label>
            <div className="flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-2xl">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent px-3 py-1.5 text-xs text-indigo-300 font-mono truncate focus:outline-none select-all"
              />
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-indigo-600/30 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Quick Share Buttons (WhatsApp & Telegram) */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Instant Messenger Share
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleWhatsAppShare}
                className="p-3 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleTelegramShare}
                className="p-3 rounded-2xl bg-sky-950/60 hover:bg-sky-900/60 border border-sky-500/40 text-sky-300 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4 text-sky-400" />
                <span>Telegram</span>
              </button>
            </div>
          </div>

          {/* Instructions for your friends */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>How Your Friends Can Join (3 Easy Steps):</span>
            </h4>
            <ol className="space-y-1.5 list-decimal pl-4 text-[11px] text-slate-400 leading-relaxed">
              <li>
                Click the link in WhatsApp/browser: <strong className="text-indigo-300">Open on phone or laptop</strong>.
              </li>
              <li>
                Click <strong className="text-white">"Join / Sign In"</strong> in the top menu and select their college or type their custom college name.
              </li>
              <li>
                Upload their resume or list their skills to start matching and building hackathon teams with you!
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl cursor-pointer transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
