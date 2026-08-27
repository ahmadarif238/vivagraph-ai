import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Shield, Zap, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CtaBannerProps {
  onOpenSandbox: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenSandbox }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.8 }
    });
  };

  return (
    <section className="py-20 relative overflow-hidden bg-[#07090e]">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Glowing Banner Box */}
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-indigo-950 via-[#101424] to-purple-950 border border-indigo-500/40 shadow-2xl shadow-indigo-950/60 overflow-hidden text-center max-w-5xl mx-auto">
          
          {/* Ambient Glow Circles */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
            START BUILDING IN MINUTES
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Ready to Supercharge Your AI Agents with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">
              Visual Graph Reasoning?
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers and enterprise AI architects building deterministic, 
            zero-hallucination graph agents with VivaGraph AI.
          </p>

          {/* Action Form or Quick Launch */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            {!subscribed ? (
              <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email..."
                  required
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm whitespace-nowrap shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Get Early Access</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Invite dispatched! Check your inbox for VivaGraph SDK access keys.</span>
              </div>
            )}
          </div>

          {/* Secondary Sandbox CTA */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
            <button
              onClick={onOpenSandbox}
              className="text-indigo-300 hover:text-white underline underline-offset-4 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Or test the live Interactive Sandbox now</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
