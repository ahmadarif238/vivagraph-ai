import React, { useState } from 'react';
import { DEMO_ITEMS } from '../data/mockData';
import { DemoItem } from '../types';
import { Layers, Terminal, ArrowUpRight, Sparkles, ChevronUp, ChevronDown, Bot, Zap } from 'lucide-react';

interface StickyDockProps {
  onSelectDemo: (demo: DemoItem) => void;
  onOpenSandbox: () => void;
}

export const StickyDock: React.FC<StickyDockProps> = ({ onSelectDemo, onOpenSandbox }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[92%] sm:w-auto">
      <div className="relative">
        
        {/* Dropdown list of 12+ Demos */}
        {dropdownOpen && (
          <div className="absolute bottom-full left-0 mb-3 w-72 sm:w-80 bg-[#0d111d] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-2 space-y-1 animate-in fade-in slide-in-from-bottom-2 max-h-72 overflow-y-auto">
            <div className="px-3 py-1.5 text-[11px] font-mono text-slate-400 border-b border-slate-800 flex items-center justify-between">
              <span>SELECT AGENT BLUEPRINT</span>
              <span className="text-indigo-400">12 Demos</span>
            </div>
            {DEMO_ITEMS.map((demo) => (
              <button
                key={demo.id}
                onClick={() => {
                  setDropdownOpen(false);
                  onSelectDemo(demo);
                }}
                className="w-full text-left p-2 rounded-xl hover:bg-slate-800/80 text-xs text-slate-200 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="truncate max-w-[180px] font-medium">{demo.title}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                  {demo.categoryLabel}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Main Dock Bar */}
        <div className="glass-panel p-2 rounded-2xl border border-indigo-500/30 shadow-2xl shadow-black/80 flex items-center gap-2 sm:gap-3 backdrop-blur-xl bg-[#0a0d16]/90">
          
          {/* Quick Demo Selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">12+ Demos</span>
              <span className="sm:hidden">Demos</span>
              {dropdownOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Sandbox trigger */}
          <button
            onClick={onOpenSandbox}
            className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Sandbox</span>
          </button>

          {/* Deploy / Buy CTA */}
          <a
            href="#pricing"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Deploy VivaGraph</span>
            <span className="sm:hidden">Deploy</span>
          </a>
        </div>

      </div>
    </div>
  );
};
