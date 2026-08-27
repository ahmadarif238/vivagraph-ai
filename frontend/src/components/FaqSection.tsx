import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/mockData';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 relative bg-[#07090e] border-t border-slate-800/80">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Everything You Need to Know <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-300">
              About VivaGraph AI
            </span>
          </h2>
          <p className="text-slate-400 mt-4 text-sm sm:text-base">
            Have questions about knowledge graph reasoning, security, or enterprise deployments? 
            We've answered the most common queries below.
          </p>
        </div>

        {/* Accordions List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className={`glass-panel rounded-2xl border transition-all overflow-hidden ${
                  isOpen ? 'border-indigo-500/50 bg-slate-900/90 shadow-xl' : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleOpen(item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-heading font-bold text-sm sm:text-base text-white">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-indigo-600 border-indigo-500 text-white' : 'text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 animate-in fade-in">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
