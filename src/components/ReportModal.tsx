import React, { useState } from 'react';
import { X, ShieldAlert, Ban, Flag, CheckCircle } from 'lucide-react';
import { User } from '../types';
import { storage } from '../services/storage';

interface ReportModalProps {
  targetUser: User;
  currentUserId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  targetUser,
  currentUserId,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState('Inappropriate content or message');
  const [details, setDetails] = useState('');
  const [blockAlso, setBlockAlso] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storage.createReport(currentUserId, targetUser.id, reason, details);
    if (blockAlso) {
      storage.blockUser(currentUserId, targetUser.id);
    }
    setSubmitted(true);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <ShieldAlert className="w-5 h-5" />
            <span>Report or Block {targetUser.name}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Report Submitted</h4>
            <p className="text-xs text-slate-400">
              Thank you for keeping CampusConnect safe. Our student moderation team will review this report shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reason for Report
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
              >
                <option value="Inappropriate content or message">Inappropriate content or message</option>
                <option value="Harassment or bullying">Harassment or bullying</option>
                <option value="Spam or fraudulent activity">Spam or fraudulent activity</option>
                <option value="Impersonation / Fake student profile">Impersonation / Fake student profile</option>
                <option value="Plagiarism / Stolen project portfolio">Plagiarism / Stolen project portfolio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                rows={3}
                placeholder="Describe what occurred..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={blockAlso}
                  onChange={e => setBlockAlso(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-rose-500"
                />
                <span className="flex items-center gap-1">
                  <Ban className="w-3.5 h-3.5 text-rose-400" />
                  Also block this user from contacting you
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
