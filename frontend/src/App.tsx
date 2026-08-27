/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DemoShowcase } from './components/DemoShowcase';
import { GraphSandbox } from './components/GraphSandbox';
import { FeatureBento } from './components/FeatureBento';
import { InnerPagesShowcase } from './components/InnerPagesShowcase';
import { WorkflowSection } from './components/WorkflowSection';
import { ComparisonSection } from './components/ComparisonSection';
import { IntegrationsSection } from './components/IntegrationsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { PricingSection } from './components/PricingSection';
import { FaqSection } from './components/FaqSection';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { DemoPreviewModal } from './components/DemoPreviewModal';
import { StickyDock } from './components/StickyDock';
import { DemoItem } from './types';

export default function App() {
  const [selectedDemo, setSelectedDemo] = useState<DemoItem | null>(null);
  const [sandboxPrompt, setSandboxPrompt] = useState<string | undefined>(undefined);

  const handleOpenSandbox = () => {
    const el = document.getElementById('sandbox');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenSandboxWithDemo = (demo: DemoItem) => {
    setSandboxPrompt(`Autonomous execution for ${demo.title}: ${demo.description}`);
    const el = document.getElementById('sandbox');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-[#e2e8f0] font-sans selection:bg-indigo-500 selection:text-white relative">
      
      {/* Navigation */}
      <Navbar onOpenSandbox={handleOpenSandbox} />

      {/* Hero Section */}
      <HeroSection onOpenSandbox={handleOpenSandbox} />

      {/* 12+ Demo Showcase Filter Grid */}
      <DemoShowcase
        onSelectDemo={(demo) => setSelectedDemo(demo)}
        onOpenSandboxWithDemo={handleOpenSandboxWithDemo}
      />

      {/* Interactive Live Graph Agent Sandbox */}
      <GraphSandbox initialPrompt={sandboxPrompt} />

      {/* Core Engine Features Bento Grid */}
      <FeatureBento />

      {/* Studio Suite & Inner Pages Layouts */}
      <InnerPagesShowcase />

      {/* How it Works / 4-step Pipeline */}
      <WorkflowSection />

      {/* Comparison: Traditional LLM vs VivaGraph */}
      <ComparisonSection />

      {/* Integrations & Supported Models */}
      <IntegrationsSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Pricing & Licensing Plans */}
      <PricingSection />

      {/* FAQ */}
      <FaqSection />

      {/* High-conversion CTA Banner */}
      <CtaBanner onOpenSandbox={handleOpenSandbox} />

      {/* Footer */}
      <Footer />

      {/* Interactive Demo Preview Modal */}
      <DemoPreviewModal
        demo={selectedDemo}
        onClose={() => setSelectedDemo(null)}
        onLaunchInSandbox={handleOpenSandboxWithDemo}
      />

      {/* Floating Bottom Showcase Dock */}
      <StickyDock
        onSelectDemo={(demo) => setSelectedDemo(demo)}
        onOpenSandbox={handleOpenSandbox}
      />

    </div>
  );
}
