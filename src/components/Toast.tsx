import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-xl border border-pink-500/30 flex items-center gap-2.5 text-xs max-w-md">
        <div className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0">
          <Sparkles className="w-3 h-3" />
        </div>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};
