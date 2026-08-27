import React, { useState, useMemo } from 'react';
import { DemoCategory, DemoItem } from '../types';
import { DEMO_ITEMS } from '../data/mockData';
import { Sparkles, Eye, ArrowUpRight, Search, Zap, Layers, Cpu, Heart, CheckCircle, ExternalLink, Filter } from 'lucide-react';

interface DemoShowcaseProps {
  onSelectDemo: (demo: DemoItem) => void;
  onOpenSandboxWithDemo?: (demo: DemoItem) => void;
}

export const DemoShowcase: React.FC<DemoShowcaseProps> = ({ onSelectDemo, onOpenSandboxWithDemo }) => {
  const [selectedCategory, setSelectedCategory] = useState<DemoCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const categories: { key: DemoCategory; label: string; count: number }[] = [
    { key: 'all', label: 'All Demos', count: DEMO_ITEMS.length },
    { key: 'autonomous', label: 'Autonomous Agents', count: DEMO_ITEMS.filter(d => d.category === 'autonomous').length },
    { key: 'graphs', label: 'Knowledge Graphs', count: DEMO_ITEMS.filter(d => d.category === 'graphs').length },
    { key: 'swarms', label: 'Multi-Agent Swarms', count: DEMO_ITEMS.filter(d => d.category === 'swarms').length },
    { key: 'code', label: 'Dev & Code Graphs', count: DEMO_ITEMS.filter(d => d.category === 'code').length },
    { key: 'enterprise', label: 'Enterprise RAG++', count: DEMO_ITEMS.filter(d => d.category === 'enterprise').length },
    { key: 'analytics', label: 'Data Intelligence', count: DEMO_ITEMS.filter(d => d.category === 'analytics').length },
  ];

  const filteredDemos = useMemo(() => {
    return DEMO_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="demos" className="py-24 relative bg-[#090b10] border-t border-slate-800/80">
      
      {/* Background radial accent */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-4">
            <Layers className="w-3.5 h-3.5" />
            SHOWCASE DEMO MATRIX
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            12+ Production-Ready <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">
              Graph Agent Architectures
            </span>
          </h2>
          <p className="text-slate-400 mt-4 text-base sm:text-lg">
            Explore curated visual graph agent blueprints for biomedical discovery, multi-agent swarms, 
            cyber threat defense, and autonomous software engineering.
          </p>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800/80">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25 border-transparent'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agent demos..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Demo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredDemos.map((demo) => {
            const isFav = !!favorites[demo.id];

            return (
              <div
                key={demo.id}
                onClick={() => onSelectDemo(demo)}
                className="group relative glass-panel rounded-2xl overflow-hidden border border-slate-800/90 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-indigo-950/40 flex flex-col cursor-pointer"
              >
                {/* Image Container with Overlay */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-950">
                  <img
                    src={demo.image}
                    alt={demo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  
                  {/* Gradient shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d121c] via-transparent to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                    <div className="flex items-center gap-1.5">
                      {demo.badge && (
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${demo.badgeColor}`}
                        >
                          {demo.badge}
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/60 text-slate-300 backdrop-blur-md border border-white/10">
                        {demo.categoryLabel}
                      </span>
                    </div>

                    <button
                      onClick={(e) => toggleFavorite(demo.id, e)}
                      className={`p-2 rounded-lg backdrop-blur-md border transition-all ${
                        isFav
                          ? 'bg-rose-500/30 border-rose-500/50 text-rose-400'
                          : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                      }`}
                      aria-label="Save Demo"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-400' : ''}`} />
                    </button>
                  </div>

                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDemo(demo);
                      }}
                      className="px-4 py-2 rounded-xl bg-white text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-lg hover:bg-slate-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Live Preview</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenSandboxWithDemo) {
                          onOpenSandboxWithDemo(demo);
                        } else {
                          onSelectDemo(demo);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg hover:bg-indigo-500 transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>Inspect Graph</span>
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Model & Latency tag */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                      <span className="text-indigo-400 flex items-center gap-1">
                        <Cpu className="w-3 h-3 inline" />
                        {demo.model}
                      </span>
                      <span className="text-emerald-400">{demo.speed} latency</span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {demo.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                      {demo.description}
                    </p>
                  </div>

                  {/* Features Tag Pills */}
                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div className="flex flex-wrap gap-1.5">
                      {demo.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60 font-mono"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>

                    {/* Bottom stats row */}
                    <div className="flex items-center justify-between pt-2 text-xs">
                      <span className="text-slate-400 text-[11px] font-mono">
                        <strong className="text-slate-200 font-semibold">{demo.nodesCount.toLocaleString()}</strong> nodes mapped
                      </span>

                      <div className="flex items-center gap-1 text-indigo-400 group-hover:text-indigo-300 text-xs font-semibold">
                        <span>Preview Demo</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search Result */}
        {filteredDemos.length === 0 && (
          <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800 max-w-md mx-auto">
            <Search className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <h4 className="text-white font-bold text-base">No agent blueprints match "{searchQuery}"</h4>
            <p className="text-slate-400 text-xs mt-1">Try searching for keywords like "biotech", "swarm", or "security".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
