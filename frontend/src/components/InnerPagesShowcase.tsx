import React, { useState } from 'react';
import { INNER_PAGES_SHOWCASE } from '../data/mockData';
import { Layers, Monitor, Tablet, Smartphone, ArrowRight, Check, Sparkles, Terminal, Cpu } from 'lucide-react';

export const InnerPagesShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const currentPage = INNER_PAGES_SHOWCASE[activeTab];

  return (
    <section id="studio-pages" className="py-24 relative bg-[#07090e] border-t border-slate-800/80">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-4">
            <Layers className="w-3.5 h-3.5" />
            STUDIO SUITE & INNER PAGES
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Comprehensive Workspace & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">
              Developer Tooling Pages
            </span>
          </h2>
          <p className="text-slate-400 mt-4 text-base sm:text-lg">
            Everything your engineering team needs to design, debug, optimize, and deploy 
            mission-critical graph agent topologies.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {INNER_PAGES_SHOWCASE.map((page, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={page.id}
                onClick={() => setActiveTab(idx)}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-600/30'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{page.title}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {page.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Showcase Device Frame Container */}
        <div className="glass-panel p-4 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
          
          {/* Header Bar inside frame */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-indigo-400">{currentPage.subtitle}</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">{currentPage.title}</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">{currentPage.description}</p>
            </div>

            {/* Viewport controls */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                  deviceMode === 'desktop' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                  deviceMode === 'tablet' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-4 h-4" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                  deviceMode === 'mobile' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>
          </div>

          {/* Interactive Screen Preview Container */}
          <div className="mt-8 flex justify-center items-center bg-[#05070c] rounded-2xl p-4 sm:p-6 overflow-hidden min-h-[380px] border border-slate-900">
            <div
              className={`transition-all duration-500 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative bg-[#0b0e17] ${
                deviceMode === 'desktop' ? 'w-full max-w-4xl' :
                deviceMode === 'tablet' ? 'w-full max-w-xl' : 'w-full max-w-sm'
              }`}
            >
              {/* Browser bar */}
              <div className="bg-[#121624] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-[11px] text-slate-400 truncate">
                    vivagraph.ai/studio/{currentPage.id}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  LIVE READY
                </span>
              </div>

              {/* High-res Image preview with interactive hover tags */}
              <div className="relative h-72 sm:h-96 w-full overflow-hidden">
                <img
                  src={currentPage.previewUrl}
                  alt={currentPage.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90 hover:scale-103 transition-transform duration-700"
                />
                
                {/* Gradient shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#090b12] via-transparent to-black/20" />

                {/* Feature Chips Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 z-10">
                  {currentPage.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-lg bg-black/80 text-indigo-300 border border-indigo-500/30 backdrop-blur-md font-mono flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
