import React from 'react';
import { TESTIMONIALS } from '../data/mockData';
import { Star, MessageSquare, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 relative bg-[#090b10] border-t border-slate-800/80">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            WALL OF PROOF
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Trusted by Leading AI Labs & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">
              Autonomous Systems Teams
            </span>
          </h2>
          <p className="text-slate-400 mt-4 text-base sm:text-lg">
            See how forward-thinking architects and AI engineering leaders use VivaGraph 
            to eliminate hallucinations and deploy complex multi-agent swarms.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="glass-panel p-7 sm:p-8 rounded-3xl border border-slate-800/90 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Highlight Quote Pill */}
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 block mb-4 w-fit">
                  "{t.highlight}"
                </span>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              {/* Author Row */}
              <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center gap-3.5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-xl object-cover border border-indigo-500/30"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">{t.name}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {t.role} • <span className="text-indigo-400">{t.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
