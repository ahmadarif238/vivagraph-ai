import React from 'react';
import { INTEGRATIONS_LIST } from '../data/mockData';
import { Share2, Sparkles, Cpu, Zap, Brain, Database, GitMerge, Boxes, Code, MessageSquare, Layers, Server } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  GitMerge: <GitMerge className="w-5 h-5" />,
  Boxes: <Boxes className="w-5 h-5" />,
  Code: <Code className="w-5 h-5" />,
  MessageSquare: <MessageSquare className="w-5 h-5" />,
  Share2: <Share2 className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Server: <Server className="w-5 h-5" />
};

export const IntegrationsSection: React.FC = () => {
  return (
    <section id="integrations" className="py-24 relative bg-[#090b10] border-t border-slate-800/80">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-4">
            <Share2 className="w-3.5 h-3.5" />
            NATIVE INTEGRATIONS
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Seamlessly Connects with Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
              AI Stack & Enterprise Databases
            </span>
          </h2>
          <p className="text-slate-400 mt-4 text-base sm:text-lg">
            Plug-and-play with your existing LLM providers, graph databases, vector indexes, 
            and enterprise messaging protocols.
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {INTEGRATIONS_LIST.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-2xl border border-slate-800/90 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 flex items-center gap-4 group cursor-pointer"
            >
              <div className={`w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform shadow-inner`}>
                {iconMap[item.logo] || <Sparkles className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                  {item.name}
                </h4>
                <p className="text-[11px] text-slate-400 font-mono">
                  {item.category}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
