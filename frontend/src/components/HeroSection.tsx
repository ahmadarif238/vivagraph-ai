import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Play, Network, Shield, Cpu, Zap, Activity, CheckCircle2, ChevronRight, Share2, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeroSectionProps {
  onOpenSandbox: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSandbox }) => {
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Dynamic cycling for the hero graph pulse simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNodeIndex((prev) => (prev + 1) % 6);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#38bdf8', '#34d399']
    });
    onOpenSandbox();
  };

  const heroNodes = [
    { id: 'h1', title: 'Core Query', label: 'Semantic Goal', x: 22, y: 35, color: '#6366f1', role: 'Input Cluster' },
    { id: 'h2', title: 'Ontology Agent', label: 'Entity Triples', x: 48, y: 22, color: '#8b5cf6', role: 'Extractor' },
    { id: 'h3', title: 'Vector Store', label: 'GraphRAG++', x: 38, y: 72, color: '#06b6d4', role: 'Dense Memory' },
    { id: 'h4', title: 'Swarm Arbiter', label: 'Consensus Bus', x: 68, y: 45, color: '#ec4899', role: 'Multi-Agent' },
    { id: 'h5', title: 'Tool Pipeline', label: 'Live APIs & Code', x: 82, y: 25, color: '#10b981', role: 'Action Unit' },
    { id: 'h6', title: 'Synthesis Proof', label: 'Deterministic Output', x: 88, y: 75, color: '#f59e0b', role: 'Verified Subgraph' },
  ];

  return (
    <section className="relative pt-12 pb-24 overflow-hidden bg-grid-pattern">
      {/* Glow Ambient Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[110px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Floating Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-slate-200 text-xs sm:text-sm shadow-xl shadow-indigo-950/40 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">
              VivaGraph AI Agent Engine
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-mono text-xs hidden sm:inline">v2.5 Full Graph Reasoning</span>
            <a href="#demos" className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 font-medium ml-1">
              View Demos <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Hero Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Visual Graph AI Agents for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">
              Autonomous Reasoning
            </span>{' '}
            & Swarms
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Escape the limitations of flat vector chunks. VivaGraph empowers AI agents to construct 
            live multi-hop knowledge graphs, coordinate collaborative swarms, and execute deterministic 
            workflows with <span className="text-indigo-300 font-mono font-semibold">48ms latency</span>.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={triggerConfetti}
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-3 group cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-indigo-200 group-hover:rotate-12 transition-transform" />
              <span>Launch Live Graph Sandbox</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#demos"
              className="w-full sm:w-auto px-7 py-4 text-base font-medium text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/70 hover:border-slate-600 rounded-2xl transition-all flex items-center justify-center gap-2.5 backdrop-blur-md"
            >
              <Network className="w-5 h-5 text-indigo-400" />
              <span>Explore 12+ Pre-built Demos</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 pt-4 text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Hallucination Proofs</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100k+ WebGL Nodes</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>SOC2 & Enterprise Ready</span>
            </span>
          </div>
        </div>

        {/* Hero Interactive Visual Graph Mockup Window */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          {/* Outer Frame */}
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-indigo-500/30 via-purple-500/20 to-slate-800/50 shadow-2xl shadow-indigo-950/60">
            
            {/* Top Window Bar */}
            <div className="bg-[#0e131f] rounded-t-[22px] px-4 py-3 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 font-mono text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-indigo-400" />
                  vivagraph://agent-runtime/live-graph-canvas.v2
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  60 FPS WebGL
                </span>
                <span className="hidden sm:inline text-slate-500">|</span>
                <span className="hidden sm:inline text-slate-400">Active Topology: Autonomous Swarm</span>
              </div>
            </div>

            {/* Visual Canvas Area */}
            <div className="bg-[#090b11] rounded-b-[22px] p-4 sm:p-8 relative min-h-[420px] overflow-hidden">
              
              {/* Dynamic SVG Connection Mesh */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Connecting lines */}
                <line x1="22%" y1="35%" x2="48%" y2="22%" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="2" strokeDasharray="4 4" className="animate-dash-flow" />
                <line x1="22%" y1="35%" x2="38%" y2="72%" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="2" />
                <line x1="48%" y1="22%" x2="68%" y2="45%" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="2.5" />
                <line x1="38%" y1="72%" x2="68%" y2="45%" stroke="rgba(236, 72, 153, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="68%" y1="45%" x2="82%" y2="25%" stroke="rgba(16, 185, 129, 0.5)" strokeWidth="2" />
                <line x1="68%" y1="45%" x2="88%" y2="75%" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="2.5" strokeDasharray="5 5" className="animate-dash-flow" />
                <line x1="82%" y1="25%" x2="88%" y2="75%" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1.5" />
              </svg>

              {/* Interactive Nodes on Canvas */}
              {heroNodes.map((node, index) => {
                const isActive = activeNodeIndex === index;
                const isHovered = hoveredNode === node.id;

                return (
                  <div
                    key={node.id}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => onOpenSandbox()}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform duration-300 ${
                      isActive || isHovered ? 'scale-110 z-30' : 'hover:scale-105'
                    }`}
                  >
                    {/* Glowing pulse ring */}
                    {isActive && (
                      <div
                        className="absolute inset-0 -m-3 rounded-2xl animate-ping opacity-30"
                        style={{ backgroundColor: node.color }}
                      />
                    )}

                    {/* Node Card */}
                    <div
                      className={`px-3 py-2.5 rounded-xl border backdrop-blur-md transition-all shadow-xl ${
                        isActive || isHovered
                          ? 'bg-slate-900/95 border-indigo-400 shadow-indigo-500/30 ring-2 ring-indigo-500/20'
                          : 'bg-slate-900/80 border-slate-700/60 shadow-black/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: node.color }}
                        />
                        <div>
                          <p className="text-xs font-bold text-white tracking-tight">{node.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono -mt-0.5">{node.label}</p>
                        </div>
                      </div>
                    </div>

                    {/* Popover on hover or active */}
                    {(isHovered || (isActive && !hoveredNode)) && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-2 rounded-lg bg-slate-950/95 border border-indigo-500/40 text-[11px] text-slate-300 shadow-2xl z-40 pointer-events-none animate-in fade-in">
                        <p className="font-semibold text-indigo-300">{node.role}</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">Real-time dynamic ontology traversal</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Floating Live Telemetry Cards */}
              <div className="absolute top-4 left-4 z-10 hidden sm:block">
                <div className="glass-panel p-3 rounded-xl max-w-xs space-y-1.5 shadow-lg border border-slate-800">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-indigo-400" />
                      Swarm Reasoning Trace
                    </span>
                    <span className="font-mono text-emerald-400 text-[10px]">Optimal Path</span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full w-[78%] animate-pulse" />
                  </div>
                  <p className="text-[10px] text-slate-300 font-mono">3rd-hop causal validation verified (0.04s)</p>
                </div>
              </div>

              {/* Floating Bottom Action Prompt Preview */}
              <div className="absolute bottom-4 right-4 z-10 hidden sm:block">
                <button
                  onClick={onOpenSandbox}
                  className="glass-panel px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs text-slate-200 hover:text-white hover:border-indigo-400 transition-colors shadow-lg cursor-pointer group"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Run Interactive Sandbox Query</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Bar Section like ThemeForest showcase */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center hover:border-indigo-500/40 transition-colors">
            <p className="font-heading text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300">
              12+
            </p>
            <p className="text-sm font-semibold text-slate-200 mt-1">Pre-built Demos</p>
            <p className="text-xs text-slate-400 mt-0.5">Ready-to-deploy agent topologies</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center hover:border-indigo-500/40 transition-colors">
            <p className="font-heading text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
              100k+
            </p>
            <p className="text-sm font-semibold text-slate-200 mt-1">WebGL Node Scale</p>
            <p className="text-xs text-slate-400 mt-0.5">Smooth 60FPS physics render</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center hover:border-indigo-500/40 transition-colors">
            <p className="font-heading text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              48ms
            </p>
            <p className="text-sm font-semibold text-slate-200 mt-1">Multi-Hop Latency</p>
            <p className="text-xs text-slate-400 mt-0.5">Sub-second graph traversal</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center hover:border-indigo-500/40 transition-colors">
            <p className="font-heading text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
              -89.4%
            </p>
            <p className="text-sm font-semibold text-slate-200 mt-1">Hallucination Drop</p>
            <p className="text-xs text-slate-400 mt-0.5">Deterministic causal verification</p>
          </div>
        </div>

      </div>
    </section>
  );
};
