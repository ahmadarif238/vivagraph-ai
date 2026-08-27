import React, { useState } from 'react';
import { PRICING_PLANS } from '../data/mockData';
import { Check, Sparkles, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const handleSelectPlan = (planName: string) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <section id="pricing" className="py-24 relative bg-[#07090e] border-t border-slate-800/80">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            TRANSPARENT LICENSING
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Predictable Pricing for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">
              Graph Agent Scaling
            </span>
          </h2>
          <p className="text-slate-400 mt-4 text-base sm:text-lg">
            Deploy independent agents or scale to massive enterprise multi-agent clusters. 
            All plans include WebGL visualization and zero markup on model API tokens.
          </p>

          {/* Billing Switcher */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                !isAnnual ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                isAnnual ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`glass-panel rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative shadow-2xl ${
                  plan.highlighted
                    ? 'border-2 border-indigo-500 shadow-indigo-950/60 bg-gradient-to-b from-[#131929] to-[#0a0d16] lg:-translate-y-3'
                    : 'border border-slate-800 hover:border-slate-700 bg-slate-950/60'
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-mono font-bold tracking-wider shadow-lg">
                    {plan.badge}
                  </div>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <div className="border-b border-slate-800/80 pb-6 mb-6">
                    <h3 className="font-heading text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-2 min-h-[36px]">{plan.tagline}</p>
                    
                    {/* Price Header */}
                    <div className="mt-5 flex items-baseline gap-1">
                      <span className="font-heading text-4xl sm:text-5xl font-black text-white">
                        ${price}
                      </span>
                      <span className="text-xs font-mono text-slate-400">/ month</span>
                    </div>
                    {isAnnual && (
                      <p className="text-[11px] font-mono text-emerald-400 mt-1">Billed annually (${price * 12}/yr)</p>
                    )}
                  </div>

                  {/* Core Limits Box */}
                  <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 mb-6 space-y-1.5 text-xs font-mono">
                    <p className="text-indigo-300 font-semibold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      {plan.nodeLimit}
                    </p>
                    <p className="text-slate-300">{plan.agentsCount}</p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Included Capabilities:</p>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.name)}
                  className={`w-full py-3.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
