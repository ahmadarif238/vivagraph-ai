import React from 'react';
import { FEATURE_ITEMS } from '../data/mockData';
import { Network, Cpu, Bot, Sparkles, Workflow, ShieldCheck, ArrowRight, Zap, Check } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Network: <Network className="w-6 h-6 text-indigo-400" />,
  Cpu: <Cpu className="w-6 h-6 text-cyan-400" />,
  Bot: <Bot className="w-6 h-6 text-emerald-400" />,
  Sparkles: <Sparkles className="w-6 h-6 text-amber-400" />,
  Workflow: <Workflow className="w-6 h-6 text-purple-400" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-rose-400" />,
};

export const FeatureBento: React.FC = () => {
  return (
    <section id="features" className="py-24 relative bg-[#090b10] border-t border-slate-800/80">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-4">
            <Zap className="w-3.5 h-3.5" />
            ENGINE ARCHITECTURE
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">
              High-Dimensional Graph Reasoning
            </span>
          </h2>
          <p className="text-slate-400 mt-4 text-base sm:text-lg">
            VivaGraph blends WebGL hardware acceleration, dynamic ontology synthesis, 
            and multi-agent consensus protocols into a unified autonomous runtime.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURE_ITEMS.map((feature, idx) => (
            <div
              key={feature.id}
              className={`glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/90 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-xl hover:shadow-indigo-950/30 ${
                idx === 0 || idx === 3 ? 'lg:col-span-2' : ''
              }`}
            >
              <div>
                {/* Top Row: Icon + Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                    {iconMap[feature.icon] || <Network className="w-6 h-6 text-indigo-400" />}
                  </div>
                  {feature.badge && (
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                      {feature.badge}
                    </span>
                  )}
                </div>

                <span className="text-xs font-mono text-indigo-400 block mb-1">
                  {feature.subtitle}
                </span>

                <h3 className="font-heading text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Stat Card */}
              {feature.stats && (
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">{feature.stats.label}</span>
                  <span className="font-heading font-bold text-base text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
                    {feature.stats.value}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
