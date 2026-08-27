import React from 'react';
import { WORKFLOW_STEPS } from '../data/mockData';
import { Database, Users, Network, CheckCircle2, ArrowRight, Sparkles, Workflow } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Database: <Database className="w-5 h-5 text-indigo-400" />,
  Users: <Users className="w-5 h-5 text-purple-400" />,
  Network: <Network className="w-5 h-5 text-cyan-400" />,
  CheckCircle2: <CheckCircle2 className="w-5 h-5 text-emerald-400" />
};

export const WorkflowSection: React.FC = () => {
  return (
    <section id="workflow" className="py-24 relative bg-[#090b10] border-t border-slate-800/80">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4">
            <Workflow className="w-3.5 h-3.5" />
            AUTONOMOUS PIPELINE
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How VivaGraph Orchestrates <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-300">
              Autonomous Graph Reasoning
            </span>
          </h2>
          <p className="text-slate-400 mt-4 text-base sm:text-lg">
            From ingestion of unstructured data to deterministic multi-agent execution, 
            every step is transparent, provable, and self-improving.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {WORKFLOW_STEPS.map((step, idx) => (
            <div
              key={step.step}
              className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800/90 hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-xl relative"
            >
              {/* Step number badge */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {iconMap[step.icon]}
                  </div>
                  <span className="font-heading text-2xl font-black text-slate-700 group-hover:text-indigo-400/80 transition-colors">
                    {step.step}
                  </span>
                </div>

                <span className="text-xs font-mono text-indigo-400 block mb-1">
                  {step.subtitle}
                </span>

                <h3 className="font-heading text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Metric Tag */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">Performance</span>
                <span className="text-emerald-400 font-mono font-semibold">{step.metric}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
