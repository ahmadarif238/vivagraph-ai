import React from 'react';
import { Network, Sparkles, Github, Twitter, Disc as Discord, ArrowUp, Activity, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#05070c] border-t border-slate-900 pt-16 pb-12 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-[#0d111a] rounded-[9px] flex items-center justify-center">
                  <Network className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="font-heading text-lg font-bold text-white">
                VivaGraph<span className="text-indigo-400">.ai</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Next-generation visual graph AI agent platform built for autonomous multi-hop reasoning, 
              real-time ontology synthesis, and decentralized multi-agent swarm orchestration.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-mono border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                All Systems Operational (99.99%)
              </span>
            </div>
          </div>

          {/* Col 2: Demos & Blueprints */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white">Agent Demos</h4>
            <ul className="space-y-2">
              <li><a href="#demos" className="hover:text-indigo-300 transition-colors">Autonomous Graph Agent</a></li>
              <li><a href="#demos" className="hover:text-indigo-300 transition-colors">Multi-Agent Swarms</a></li>
              <li><a href="#demos" className="hover:text-indigo-300 transition-colors">Biotech Ontology Explorer</a></li>
              <li><a href="#demos" className="hover:text-indigo-300 transition-colors">Codebase Logic Graph</a></li>
              <li><a href="#demos" className="hover:text-indigo-300 transition-colors">Financial Crime Subgraphs</a></li>
            </ul>
          </div>

          {/* Col 3: Studio & Tooling */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white">Developer Suite</h4>
            <ul className="space-y-2">
              <li><a href="#studio-pages" className="hover:text-indigo-300 transition-colors">Visual Canvas Studio</a></li>
              <li><a href="#studio-pages" className="hover:text-indigo-300 transition-colors">Cypher Query Console</a></li>
              <li><a href="#studio-pages" className="hover:text-indigo-300 transition-colors">Swarm Topology Manager</a></li>
              <li><a href="#studio-pages" className="hover:text-indigo-300 transition-colors">Causal Trace Debugger</a></li>
              <li><a href="#integrations" className="hover:text-indigo-300 transition-colors">Native Integrations</a></li>
            </ul>
          </div>

          {/* Col 4: Resources & Legal */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-white">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#pricing" className="hover:text-indigo-300 transition-colors">Pricing & Tokens</a></li>
              <li><a href="#faq" className="hover:text-indigo-300 transition-colors">Knowledge Base & FAQ</a></li>
              <li><a href="#" className="hover:text-indigo-300 transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-indigo-300 transition-colors">SOC2 Compliance</a></li>
              <li><a href="#" className="hover:text-indigo-300 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & Back to top */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} VivaGraph AI Technologies Inc. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <span>Crafted with High Precision Visual Graph Reasoning</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
              aria-label="Back to top"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
