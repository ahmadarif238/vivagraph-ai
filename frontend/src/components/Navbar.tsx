import React, { useState, useEffect } from 'react';
import { Network, Sparkles, Menu, X, ArrowRight, Layers, Bot, Cpu, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenSandbox: () => void;
  onSelectCategory?: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSandbox }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Announcement Bar like LA-Studio Vecna Showcase */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 text-xs py-2 px-4 border-b border-indigo-500/20 text-center relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 md:gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-medium text-[11px] border border-indigo-400/30">
            <Sparkles className="w-3 h-3 text-indigo-300 animate-pulse" />
            VivaGraph v2.5
          </span>
          <span className="text-slate-300 text-xs hidden sm:inline">
            Next-Gen Visual Graph AI Agent Engine with 12+ Interactive Demos & Swarm Topology
          </span>
          <a
            href="#demos"
            className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 underline underline-offset-2 transition-colors text-xs ml-1"
          >
            Explore Demos <ArrowRight className="w-3 h-3 inline" />
          </a>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#090b10]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-black/50 py-3'
            : 'bg-transparent border-b border-slate-800/30 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-[#0d111a] rounded-[10px] flex items-center justify-center">
                <Network className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  VivaGraph<span className="text-indigo-400">.ai</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  AGENT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight -mt-0.5 hidden sm:block">
                Visual Graph Reasoning Engine
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <a
              href="#demos"
              className="px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Demos</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                12
              </span>
            </a>
            <a
              href="#sandbox"
              onClick={(e) => {
                e.preventDefault();
                onOpenSandbox();
                const el = document.getElementById('sandbox');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors flex items-center gap-1.5"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Live Sandbox</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </a>
            <a
              href="#features"
              className="px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              Agent Capabilities
            </a>
            <a
              href="#studio-pages"
              className="px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              Inner Pages
            </a>
            <a
              href="#workflow"
              className="px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              How it Works
            </a>
            <a
              href="#integrations"
              className="px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              Integrations
            </a>
            <a
              href="#pricing"
              className="px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenSandbox}
              className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Interactive Studio</span>
            </button>
            <a
              href="#pricing"
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center gap-2 group"
            >
              <span>Get VivaGraph</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0a0d14] border-b border-slate-800 px-4 pt-3 pb-6 mt-3 space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <a
                href="#demos"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-slate-200"
              >
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>12+ Demos</span>
              </a>
              <a
                href="#sandbox"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSandbox();
                }}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-slate-200"
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>Live Sandbox</span>
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-slate-200"
              >
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>Capabilities</span>
              </a>
              <a
                href="#studio-pages"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-slate-200"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Inner Pages</span>
              </a>
              <a
                href="#workflow"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-slate-200"
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Workflow</span>
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-slate-200"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Pricing Plans</span>
              </a>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSandbox();
                }}
                className="w-full py-2.5 text-center text-sm font-medium bg-slate-800 text-white rounded-xl"
              >
                Open Agent Sandbox
              </button>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-600/30"
              >
                Deploy VivaGraph AI Agent
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
