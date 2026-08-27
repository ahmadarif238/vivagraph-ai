import React, { useState, useEffect, useRef } from 'react';
import { GraphNode, GraphEdge } from '../types';
import { INITIAL_SANDBOX_NODES, INITIAL_SANDBOX_EDGES, SANDBOX_PRESET_PROMPTS } from '../data/mockData';
import { Play, RotateCcw, Sparkles, Terminal, Activity, Layers, Cpu, ZoomIn, ZoomOut, Maximize2, CheckCircle2, Loader2, Code, Share2, ArrowRight, ShieldCheck, Database, HelpCircle, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GraphSandboxProps {
  initialPrompt?: string;
}

export const GraphSandbox: React.FC<GraphSandboxProps> = ({ initialPrompt }) => {
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_SANDBOX_NODES);
  const [edges, setEdges] = useState<GraphEdge[]>(INITIAL_SANDBOX_EDGES);
  const [selectedPrompt, setSelectedPrompt] = useState<string>(initialPrompt || SANDBOX_PRESET_PROMPTS[0].query);
  const [customInput, setCustomInput] = useState<string>(initialPrompt || SANDBOX_PRESET_PROMPTS[0].query);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(INITIAL_SANDBOX_NODES[0]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [logs, setLogs] = useState<Array<{ time: string; message: string; type: 'info' | 'agent' | 'success' | 'warn' }>>([
    { time: '00:00.00', message: 'VivaGraph AI Agent Kernel initialized [v2.5.0-pro]', type: 'info' },
    { time: '00:00.04', message: 'WebGL 2.0 Force-Directed Canvas mounted (60 FPS)', type: 'info' },
    { time: '00:00.08', message: 'Ready to receive multi-hop semantic goals.', type: 'agent' }
  ]);

  const executionSteps = ['n-input', 'n-classifier', 'n-vector', 'n-reasoning', 'n-tools', 'n-synthesis', 'n-action'];

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStepIndex(0);

    // Reset all nodes to idle
    setNodes(prev => prev.map(n => ({
      ...n,
      status: n.id === 'n-input' ? 'running' : 'idle'
    })));

    setLogs([
      { time: '00:00.00', message: `Goal Ingestion: "${customInput.slice(0, 48)}..."`, type: 'info' }
    ]);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStepIndex(step);

      if (step < executionSteps.length) {
        const activeId = executionSteps[step];
        const prevId = executionSteps[step - 1];

        setNodes(prev => prev.map(n => {
          if (n.id === prevId) return { ...n, status: 'completed' };
          if (n.id === activeId) return { ...n, status: 'running' };
          return n;
        }));

        // Activate matching edge
        setEdges(prev => prev.map(e => ({
          ...e,
          active: e.source === prevId || e.target === activeId
        })));

        const stepNode = nodes.find(n => n.id === activeId);
        if (stepNode) {
          setSelectedNode(stepNode);
          setLogs(prev => [
            ...prev,
            {
              time: `00:00.${step * 14}`,
              message: `[${stepNode.label}] Executed: ${stepNode.details.slice(0, 50)}... (${stepNode.latency || '12ms'})`,
              type: 'agent'
            }
          ]);
        }
      } else {
        // Completion
        clearInterval(interval);
        setIsRunning(false);
        setNodes(prev => prev.map(n => ({ ...n, status: 'completed' })));
        setLogs(prev => [
          ...prev,
          {
            time: '00:00.98',
            message: '✓ Causal Graph Verified: 0 Hallucinations, 68 Entities connected, 4 Actions dispatched.',
            type: 'success'
          }
        ]);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    }, 750);
  };

  const handleSelectPreset = (query: string) => {
    setSelectedPrompt(query);
    setCustomInput(query);
  };

  return (
    <section id="sandbox" className="py-24 relative bg-[#07090e] border-t border-slate-800">
      
      {/* Background Gradients */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4">
              <Terminal className="w-3.5 h-3.5" />
              INTERACTIVE AGENT STUDIO
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Test VivaGraph AI in the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-300">
                Live Graph Reasoning Sandbox
              </span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg">
            Witness how VivaGraph breaks down unstructured queries, dynamically extracts semantic subgraphs, 
            coordinates agent roles, and guarantees zero hallucination output.
          </p>
        </div>

        {/* Preset Prompt Selectors */}
        <div className="mb-6 space-y-2">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Quick Presets & Multi-Hop Benchmarks:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SANDBOX_PRESET_PROMPTS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset.query)}
                className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                  customInput === preset.query
                    ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-lg shadow-indigo-950/50'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="text-indigo-400 font-mono">{preset.domain}</span>
                  <span className="font-mono text-[10px]">{preset.hops} hops • {preset.nodeCount} nodes</span>
                </div>
                <p className="text-xs font-semibold line-clamp-1">{preset.title}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Query Input Bar */}
        <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-slate-800 mb-8 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter goal or autonomous task for the VivaGraph agent..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer ${
              isRunning
                ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-indigo-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Traversing Graph...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Graph Agent Reasoning</span>
              </>
            )}
          </button>
        </div>

        {/* Main Sandbox Interactive Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left / Center: Interactive SVG & HTML Node Canvas (8 Cols) */}
          <div className="lg:col-span-8 glass-panel rounded-3xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl relative">
            
            {/* Canvas Header Toolbar */}
            <div className="bg-[#0b0f19] px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-slate-300 text-xs">WebGL Canvas: Active Force Topology</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.4))}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.7))}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(1);
                    setNodes(INITIAL_SANDBOX_NODES);
                    setSelectedNode(INITIAL_SANDBOX_NODES[0]);
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  title="Reset Layout"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Canvas Stage */}
            <div className="relative h-[480px] bg-[#07090f] overflow-hidden p-6 select-none bg-graph-matrix">
              
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top left',
                  width: '1000px',
                  height: '400px',
                  position: 'relative'
                }}
                className="transition-transform duration-200"
              >
                {/* SVG Edges Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {edges.map((edge) => {
                    const src = nodes.find(n => n.id === edge.source);
                    const tgt = nodes.find(n => n.id === edge.target);
                    if (!src || !tgt) return null;

                    const isActive = edge.active;

                    return (
                      <g key={edge.id}>
                        <line
                          x1={src.x + 80}
                          y1={src.y + 24}
                          x2={tgt.x + 80}
                          y2={tgt.y + 24}
                          stroke={isActive ? '#6366f1' : '#1e293b'}
                          strokeWidth={isActive ? '3' : '1.5'}
                          strokeDasharray={isActive ? '5 5' : 'none'}
                          className={isActive ? 'animate-dash-flow' : ''}
                        />
                        {edge.label && (
                          <text
                            x={(src.x + tgt.x) / 2 + 80}
                            y={(src.y + tgt.y) / 2 + 18}
                            fill={isActive ? '#a5b4fc' : '#64748b'}
                            fontSize="9"
                            fontFamily="monospace"
                            textAnchor="middle"
                            className="bg-black/80"
                          >
                            {edge.label}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Nodes Layer */}
                {nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isRunningNode = node.status === 'running';
                  const isCompleted = node.status === 'completed';

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      style={{
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                        width: '170px'
                      }}
                      className={`absolute rounded-xl p-3 border transition-all duration-300 cursor-pointer backdrop-blur-md shadow-xl ${
                        isSelected
                          ? 'bg-slate-900/95 border-indigo-400 ring-2 ring-indigo-500/30 scale-105 z-30'
                          : isRunningNode
                          ? 'bg-indigo-950/90 border-cyan-400 ring-2 ring-cyan-500/30 scale-105 z-20'
                          : isCompleted
                          ? 'bg-slate-900/80 border-slate-700/80 hover:border-slate-500 z-10'
                          : 'bg-slate-950/60 border-slate-800/80 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase ${
                            node.type === 'query' ? 'bg-indigo-500/20 text-indigo-300' :
                            node.type === 'agent' ? 'bg-purple-500/20 text-purple-300' :
                            node.type === 'model' ? 'bg-cyan-500/20 text-cyan-300' :
                            node.type === 'memory' ? 'bg-emerald-500/20 text-emerald-300' :
                            node.type === 'tool' ? 'bg-amber-500/20 text-amber-300' :
                            'bg-pink-500/20 text-pink-300'
                          }`}
                        >
                          {node.type}
                        </span>

                        {isRunningNode && (
                          <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                        )}
                        {isCompleted && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>

                      <p className="text-xs font-bold text-white tracking-tight line-clamp-1">
                        {node.label}
                      </p>

                      <p className="text-[10px] text-slate-400 font-mono mt-1 flex items-center justify-between">
                        <span>{node.status}</span>
                        <span className="text-indigo-400">{node.latency || '4ms'}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Console Log Stream */}
            <div className="bg-[#080b12] border-t border-slate-800 p-3 text-xs font-mono max-h-36 overflow-y-auto">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  Live Trace & Causal Replay Stream
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Stream: WebSocket wss://vivagraph/traces</span>
              </div>
              <div className="space-y-1">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px]">
                    <span className="text-slate-500 select-none">[{log.time}]</span>
                    <span
                      className={
                        log.type === 'success' ? 'text-emerald-400 font-semibold' :
                        log.type === 'agent' ? 'text-indigo-300' :
                        log.type === 'warn' ? 'text-amber-400' : 'text-slate-400'
                      }
                    >
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Selected Node Properties Inspector (4 Cols) */}
          <div className="lg:col-span-4 glass-panel rounded-3xl border border-slate-800 p-5 flex flex-col justify-between space-y-4">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-indigo-400">Node Inspector</span>
                    <h3 className="text-base font-bold text-white">{selectedNode.label}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      selectedNode.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      selectedNode.status === 'running' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' :
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {selectedNode.status}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 font-mono text-[11px] block mb-1">Causal Execution Details:</label>
                    <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 text-slate-200 leading-relaxed font-sans">
                      {selectedNode.details}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block">Step Latency</span>
                      <span className="text-emerald-400 font-bold text-xs">{selectedNode.latency || '12ms'}</span>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block">Node Type</span>
                      <span className="text-indigo-300 font-bold text-xs capitalize">{selectedNode.type}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 font-mono text-[11px] block mb-1 flex items-center justify-between">
                      <span>Generated Subgraph Triples:</span>
                      <span className="text-indigo-400 font-mono text-[10px]">Cypher / JSON-LD</span>
                    </label>
                    <pre className="bg-[#05070c] p-2.5 rounded-xl border border-slate-800 text-[10px] font-mono text-cyan-300 overflow-x-auto">
{`MATCH (e:Entity {id: "${selectedNode.id}"})
-[r:REASON_EDGE {confidence: 0.998}]->(target)
RETURN e.name, r.type, target.properties`}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                Select any node on the canvas to inspect its semantic state and graph relations.
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={runSimulation}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Re-Execute Graph Reasoning</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
