import React from 'react';
import { Check, X, Sparkles, Zap, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const comparisonRows = [
    {
      feature: 'Knowledge Representation',
      traditional: 'Flat, disconnected text chunk embeddings (Fixed 512 tokens)',
      vivagraph: 'Dynamic multi-dimensional knowledge ontologies & entity subgraphs',
      advantage: 'Rich relational depth'
    },
    {
      feature: 'Multi-Hop Reasoning',
      traditional: 'Brittle sequential chains; fails after 2-3 hops with high drift',
      vivagraph: 'Deterministic N-hop graph traversal with bidirectional edge verification',
      advantage: 'Unlimited hop depth'
    },
    {
      feature: 'Hallucination Mitigation',
      traditional: 'Probabilistic generation prone to factual fabrications (-15%)',
      vivagraph: 'Zero-hallucination ground truth verification via Leiden subgraphs (-89.4%)',
      advantage: 'Provable factuality'
    },
    {
      feature: 'Swarm Coordination',
      traditional: 'Linear single-turn prompt chaining with token bottlenecks',
      vivagraph: 'Decentralized Byzantine-consensus message bus for 128+ agents',
      advantage: 'Real multi-agent swarm'
    },
    {
      feature: 'Observability & Replay',
      traditional: 'Opaque black-box outputs with no causal dependency traces',
      vivagraph: 'Full causal execution graphs, Cypher query replays & 60FPS WebGL visualizer',
      advantage: '100% Deterministic audit'
    },
    {
      feature: 'Memory & Self-Healing',
      traditional: 'Static vector stores with stale embeddings and redundant chunks',
      vivagraph: 'Continuous graph consolidation, automated contradiction pruning & edge rewiring',
      advantage: 'Adaptive memory'
    }
  ];

  return (
    <section className="py-24 relative bg-[#07090e] border-t border-slate-800/80">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono mb-4">
            <Cpu className="w-3.5 h-3.5" />
            BENCHMARK COMPARISON
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Traditional LLM Chains vs. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">
              VivaGraph AI Agent Engine
            </span>
          </h2>
          <p className="text-slate-400 mt-4 text-base sm:text-lg">
            See why leading AI labs and enterprise teams are replacing brittle flat-vector RAG 
            with VivaGraph’s visual graph reasoning architecture.
          </p>
        </div>

        {/* Comparison Table Card */}
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0c101b]">
                  <th className="p-5 sm:p-6 text-xs sm:text-sm font-bold text-slate-300 w-1/4">
                    Architectural Capability
                  </th>
                  <th className="p-5 sm:p-6 text-xs sm:text-sm font-semibold text-slate-400 w-1/3 bg-slate-950/40">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>Traditional LLMs & Flat RAG</span>
                    </div>
                  </th>
                  <th className="p-5 sm:p-6 text-xs sm:text-sm font-bold text-white w-5/12 bg-indigo-950/40 border-l border-indigo-500/30">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300 font-bold">
                        VivaGraph AI Agent
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-5 sm:p-6 font-semibold text-slate-200">
                      {row.feature}
                    </td>
                    <td className="p-5 sm:p-6 text-slate-400 bg-slate-950/20">
                      <div className="flex items-start gap-2.5">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                    <td className="p-5 sm:p-6 text-slate-100 bg-indigo-950/20 border-l border-indigo-500/20">
                      <div className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-100">{row.vivagraph}</p>
                          <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {row.advantage}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
