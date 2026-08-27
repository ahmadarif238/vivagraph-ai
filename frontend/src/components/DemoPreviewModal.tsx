import React, { useState, useEffect } from 'react';
import { DemoItem } from '../types';
import { X, ExternalLink, Play, Cpu, Sparkles, Check, Monitor, Tablet, Smartphone, Copy, CheckCircle2, ArrowRight, Code, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DemoPreviewModalProps {
  demo: DemoItem | null;
  onClose: () => void;
  onLaunchInSandbox: (demo: DemoItem) => void;
}

export const DemoPreviewModal: React.FC<DemoPreviewModalProps> = ({
  demo,
  onClose,
  onLaunchInSandbox
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'visual' | 'schema' | 'cypher'>('visual');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!demo) return null;

  const handleCopySnippet = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeploy = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Outer Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#0b0e17] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="bg-[#101422] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80 cursor-pointer" onClick={onClose} />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm sm:text-base text-white">{demo.title}</h3>
                {demo.badge && (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${demo.badgeColor}`}>
                    {demo.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-slate-400">Model: {demo.model} • {demo.speed} latency</p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Viewport switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${deviceMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${deviceMode === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Tablet View"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${deviceMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Sub-tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'visual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Topology Preview
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'schema' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Agent Schema (JSON)
            </button>
            <button
              onClick={() => setActiveTab('cypher')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'cypher' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cypher & Graph Traversal
            </button>
          </div>

          {/* Visual Topology Content */}
          {activeTab === 'visual' && (
            <div className="flex flex-col items-center">
              <div
                className={`transition-all duration-300 rounded-2xl overflow-hidden border border-slate-800 bg-[#07090f] shadow-2xl relative ${
                  deviceMode === 'desktop' ? 'w-full' :
                  deviceMode === 'tablet' ? 'w-full max-w-xl' : 'w-full max-w-sm'
                }`}
              >
                <div className="relative h-72 sm:h-96 w-full overflow-hidden">
                  <img
                    src={demo.image}
                    alt={demo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e17] via-transparent to-black/30" />

                  {/* Floating Agent Status Badge */}
                  <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md text-xs space-y-1">
                    <p className="text-slate-400 font-mono text-[10px]">ACTIVE AGENT GRAPH</p>
                    <p className="text-white font-bold">{demo.nodesCount.toLocaleString()} Nodes Indexed</p>
                    <p className="text-emerald-400 font-mono text-[10px]">Zero Hallucination Verified</p>
                  </div>
                </div>

                {/* Features & Specs */}
                <div className="p-5 space-y-4">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {demo.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {demo.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 rounded-lg bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 font-mono flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Schema JSON Content */}
          {activeTab === 'schema' && (
            <div className="relative">
              <button
                onClick={handleCopySnippet}
                className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
              <pre className="bg-[#06080e] p-4 rounded-2xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
{`{
  "agent_id": "${demo.id}",
  "title": "${demo.title}",
  "category": "${demo.category}",
  "engine": "${demo.model}",
  "ontology_rules": {
    "max_depth_hops": 6,
    "confidence_threshold": 0.95,
    "consensus_protocol": "byzantine_fault_tolerant",
    "nodes_allocated": ${demo.nodesCount}
  },
  "tools": [
    "tool_live_entity_miner",
    "tool_cypher_subgraph_traversal",
    "tool_hallucination_verifier"
  ]
}`}
              </pre>
            </div>
          )}

          {/* Cypher Traversal Content */}
          {activeTab === 'cypher' && (
            <div className="space-y-3">
              <pre className="bg-[#06080e] p-4 rounded-2xl border border-slate-800 text-xs font-mono text-purple-300 overflow-x-auto">
{`// Autonomous Subgraph Reasoner Traversal Pattern
MATCH (agent:VivaAgent {id: "${demo.id}"})
-[:REASONS_OVER]->(ontology:OntologyCluster)
-[:SUBGRAPH_HOP*1..4]-(target:Entity)
WHERE target.verification_score >= 0.98
RETURN agent, ontology, target
ORDER BY target.causal_weight DESC
LIMIT 100;`}
              </pre>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="bg-[#101422] px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400 font-mono">
            Blueprint Ready for 1-Click Deployment
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onLaunchInSandbox(demo);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>Test in Live Sandbox</span>
            </button>

            <button
              onClick={handleDeploy}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Deploy Blueprint</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
