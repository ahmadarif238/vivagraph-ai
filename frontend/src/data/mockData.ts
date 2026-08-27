import { DemoItem, FeatureItem, Testimonial, PricingPlan, FaqItem, InnerPageItem, GraphNode, GraphEdge } from '../types';

export const DEMO_ITEMS: DemoItem[] = [
  {
    id: 'autonomous-core',
    title: 'Autonomous Knowledge Graph Agent',
    category: 'autonomous',
    categoryLabel: 'Autonomous Agent',
    badge: 'HOT',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    description: 'Dynamic ontology reasoning agent with continuous self-expanding entity graphs and multi-hop hypothesis generation.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    nodesCount: 1420,
    speed: '48ms',
    model: 'Gemini 2.5 Pro + VivaEngine',
    features: ['Multi-Hop Traversal', 'Real-Time Edge Rewiring', 'Zero Hallucination Verifier'],
    isPopular: true
  },
  {
    id: 'multi-agent-swarm',
    title: 'Multi-Agent Swarm Orchestrator',
    category: 'swarms',
    categoryLabel: 'Multi-Agent Swarm',
    badge: 'NEW',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Hierarchical cluster coordinator managing 12+ specialized sub-agents via asynchronous message graphs and consensus protocols.',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    nodesCount: 840,
    speed: '62ms',
    model: 'Claude 3.7 + GPT-4o Swarm',
    features: ['Consensus Arbiter', 'Dynamic Sub-Task Graph', 'Resource Load Balancing'],
    isPopular: true
  },
  {
    id: 'codebase-graph',
    title: 'Codebase Dependency & Logic Graph',
    category: 'code',
    categoryLabel: 'Dev & Code Graphs',
    badge: 'PRO',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    description: 'Full repository semantic AST mapping, architecture debt detection, automated refactoring pipelines, and PR validation.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    nodesCount: 3200,
    speed: '35ms',
    model: 'DeepSeek R1 + CodeGraph',
    features: ['AST Semantic Trees', 'Automated PR Graph Diffs', 'Breaking Change Forecast'],
    isPopular: false
  },
  {
    id: 'biotech-ontology',
    title: 'Biotech & Drug Discovery Graph Explorer',
    category: 'graphs',
    categoryLabel: 'Knowledge Graphs',
    badge: 'PRO',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    description: 'PubMed, ChEMBL, and UniProt cross-linked biomedical knowledge agent forecasting molecular binding affinity.',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    nodesCount: 5600,
    speed: '85ms',
    model: 'BioGraph Omni + Med-Gemini',
    features: ['Clinical Trial Cross-Map', 'Target Protein Scoring', 'Safety Profile Matrix'],
    isPopular: true
  },
  {
    id: 'financial-fraud',
    title: 'Financial Crime & Sybil Subgraph Agent',
    category: 'analytics',
    categoryLabel: 'Data Intelligence',
    badge: 'TRENDING',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'High-frequency transaction stream analyzer detecting circular flow schemes, laundering patterns, and synthetic IDs in 12ms.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    nodesCount: 8900,
    speed: '12ms',
    model: 'VivaFin Tensor Core',
    features: ['Circular Flow Detection', 'Real-Time Edge Weighting', 'Regulatory Audit Trail'],
    isPopular: false
  },
  {
    id: 'cyber-threat-matrix',
    title: 'Zero-Day Cyber Threat Attack Graph',
    category: 'analytics',
    categoryLabel: 'Data Intelligence',
    badge: 'HOT',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    description: 'MITRE ATT&CK synchronized autonomous defense agent modeling lateral movement paths and real-time containment playbooks.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    nodesCount: 4100,
    speed: '28ms',
    model: 'CyberShield 2.0 Agent',
    features: ['Lateral Path Simulation', 'Autonomous Quarantine', 'CVE Exploit Correlator'],
    isPopular: true
  },
  {
    id: 'web-crawler-entity',
    title: 'Autonomous Web Intelligence & Entity Linker',
    category: 'autonomous',
    categoryLabel: 'Autonomous Agent',
    badge: 'NEW',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Autonomous headless browser swarm extracting verified knowledge triples from unorganized web portals in real-time.',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80',
    nodesCount: 1950,
    speed: '74ms',
    model: 'VivaSpider LLM Agent',
    features: ['Live HTML Triple Miner', 'Confidence Scoring', 'Dynamic Source Citation'],
    isPopular: false
  },
  {
    id: 'enterprise-rag-plus',
    title: 'Enterprise GraphRAG++ Semantic Brain',
    category: 'enterprise',
    categoryLabel: 'Enterprise RAG++',
    badge: 'PRO',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    description: 'Replaces conventional brittle vector chunks with structured graph communities, hierarchical summaries, and zero-loss context retrieval.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    nodesCount: 12500,
    speed: '41ms',
    model: 'GraphRAG 3.0 Engine',
    features: ['Hierarchical Communities', 'Leiden Graph Clustering', 'Document Lineage Tracing'],
    isPopular: true
  },
  {
    id: 'customer-journey-graph',
    title: 'Omnichannel Customer Graph Agent',
    category: 'analytics',
    categoryLabel: 'Data Intelligence',
    badge: 'TRENDING',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'Predictive churn prevention and hyper-personalized interaction graph spanning CRM, product telemetry, and support tickets.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    nodesCount: 2300,
    speed: '53ms',
    model: 'VivaCustomer Core',
    features: ['Predictive LTV Pathing', 'Sentiment Flow Graphs', 'Automated Action Triggers'],
    isPopular: false
  },
  {
    id: 'supply-chain-reasoning',
    title: 'Global Supply Chain Bottleneck Solver',
    category: 'enterprise',
    categoryLabel: 'Enterprise RAG++',
    badge: 'PRO',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    description: 'Multi-tier supplier risk topology agent calculating alternative transport routes and geopolitical tariff impacts in seconds.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    nodesCount: 6700,
    speed: '46ms',
    model: 'VivaSupply Nexus',
    features: ['Tier-3 Supplier Mapping', 'Weather & Port Disruption', 'Automated Purchase POs'],
    isPopular: false
  },
  {
    id: 'legal-citation-network',
    title: 'Jurisprudence & Legal Precedent Graph',
    category: 'graphs',
    categoryLabel: 'Knowledge Graphs',
    badge: 'NEW',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'High-precision legal citation graph uncovering conflicting appellate decisions and statutory ambiguities across 50 jurisdictions.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    nodesCount: 9400,
    speed: '38ms',
    model: 'LexGraph AI',
    features: ['Statute Overrule Alerts', 'Argument Contradiction Map', 'Court Stance Profiling'],
    isPopular: false
  },
  {
    id: 'academic-research-swarm',
    title: 'Autonomous Research Paper Synthesizer',
    category: 'swarms',
    categoryLabel: 'Multi-Agent Swarm',
    badge: 'HOT',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    description: 'Literature review swarm synthesizing 500+ arXiv and bioRxiv preprints into verifiable structured hypotheses and experimental designs.',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    nodesCount: 7800,
    speed: '59ms',
    model: 'ScholarSwarm Ultra',
    features: ['Citation Co-Occurrence', 'Novelty Gap Finder', 'LaTeX Synthesis Generator'],
    isPopular: true
  }
];

export const INITIAL_SANDBOX_NODES: GraphNode[] = [
  {
    id: 'n-input',
    label: 'User Query & Context Goal',
    type: 'query',
    status: 'completed',
    x: 80,
    y: 180,
    details: 'Input: "Investigate semiconductor supply chain disruptions across East Asian fabs and forecast impact on Q4 automotive production."',
    latency: '4ms'
  },
  {
    id: 'n-classifier',
    label: 'VivaGraph Intent Classifier',
    type: 'model',
    status: 'completed',
    x: 280,
    y: 100,
    details: 'Entity Extraction: Found 18 Tier-1 Suppliers, 6 Geopolitical Chokepoints, 4 Auto Sub-assemblies.',
    latency: '14ms'
  },
  {
    id: 'n-vector',
    label: 'Vector Community Index',
    type: 'memory',
    status: 'completed',
    x: 280,
    y: 260,
    details: 'Retrieved 84 semantic clusters from global logistics and customs database.',
    latency: '22ms'
  },
  {
    id: 'n-reasoning',
    label: 'Multi-Hop Graph Reasoner',
    type: 'agent',
    status: 'running',
    x: 520,
    y: 180,
    details: 'Traversing 4th-degree dependencies between TSMC wafer allocations and Bosch ECU controllers.',
    latency: '48ms'
  },
  {
    id: 'n-tools',
    label: 'Autonomous Tool Executor',
    type: 'tool',
    status: 'idle',
    x: 740,
    y: 100,
    details: 'Scheduled Webhooks: Live Freight API, Port Congestion Index, Spot Price Market.',
    latency: 'Pending'
  },
  {
    id: 'n-synthesis',
    label: 'Knowledge Graph Synthesis',
    type: 'graph',
    status: 'idle',
    x: 740,
    y: 260,
    details: 'Constructing dynamic sub-graph with 42 nodes and 68 weighted probabilistic edges.',
    latency: 'Pending'
  },
  {
    id: 'n-action',
    label: 'Autonomous Action & PO Dispatch',
    type: 'action',
    status: 'idle',
    x: 940,
    y: 180,
    details: 'Output format: Interactive Graph Visualizer, Executive Briefing, Automated Backup Supplier Re-route.',
    latency: 'Pending'
  }
];

export const INITIAL_SANDBOX_EDGES: GraphEdge[] = [
  { id: 'e1', source: 'n-input', target: 'n-classifier', label: 'Extract Entities', active: true },
  { id: 'e2', source: 'n-input', target: 'n-vector', label: 'Context Seed', active: true },
  { id: 'e3', source: 'n-classifier', target: 'n-reasoning', label: 'Entity Schema', active: true },
  { id: 'e4', source: 'n-vector', target: 'n-reasoning', label: 'Dense Embeddings', active: true },
  { id: 'e5', source: 'n-reasoning', target: 'n-tools', label: 'Call Live APIs', active: false },
  { id: 'e6', source: 'n-reasoning', target: 'n-synthesis', label: 'Rewire Subgraph', active: false },
  { id: 'e7', source: 'n-tools', target: 'n-action', label: 'API Payloads', active: false },
  { id: 'e8', source: 'n-synthesis', target: 'n-action', label: 'Verified Proof Graph', active: false }
];

export const SANDBOX_PRESET_PROMPTS = [
  {
    title: 'Semiconductor Supply Chain Disruptions',
    query: 'Investigate semiconductor supply chain disruptions across East Asian fabs and forecast impact on Q4 automotive production.',
    domain: 'Enterprise Logistics',
    nodeCount: 42,
    hops: 4
  },
  {
    title: 'Cross-Border Money Laundering Ring',
    query: 'Detect circular fund dispersion through shell entities, nested crypto swaps, and offshore correspondent accounts.',
    domain: 'FinTech Compliance',
    nodeCount: 68,
    hops: 6
  },
  {
    title: 'Biotech Drug Repurposing & Oncology Targets',
    query: 'Identify FDA-approved kinase inhibitors with high affinity cross-binding against mutated KRAS G12D pathways.',
    domain: 'Biomedical AI',
    nodeCount: 95,
    hops: 5
  },
  {
    title: 'Zero-Day Multi-Stage Lateral Attack Graph',
    query: 'Trace compromised Active Directory service account across segmented VPC subnets to domain controller root.',
    domain: 'Cybersecurity',
    nodeCount: 54,
    hops: 7
  }
];

export const FEATURE_ITEMS: FeatureItem[] = [
  {
    id: 'feature-1',
    title: 'Visual Graph Reasoning Engine',
    subtitle: 'Beyond Flat Vector Search',
    description: 'Unlike standard single-pass LLMs that produce hallucinations, VivaGraph builds dynamic topological graphs representing every concept, entity, and causal relationship.',
    icon: 'Network',
    stats: { label: 'Hallucination Drop', value: '-89.4%' },
    badge: 'Core Breakthrough',
    gradient: 'from-indigo-500/20 via-purple-500/10 to-transparent'
  },
  {
    id: 'feature-2',
    title: '100k+ Node WebGL Turbo Visualizer',
    subtitle: 'Hardware Accelerated Rendering',
    description: 'Engineered on top of VivaGraphJS and custom WebGL shaders, inspect massive knowledge clusters, run 60FPS physics simulations, and drill into deep subgraphs effortlessly.',
    icon: 'Cpu',
    stats: { label: 'Render Speed', value: '60 FPS' },
    badge: 'Ultra Fast',
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent'
  },
  {
    id: 'feature-3',
    title: 'Multi-Agent Swarm Topology',
    subtitle: 'Hierarchical Consensus Protocol',
    description: 'Deploy swarms of specialized autonomous sub-agents that communicate via typed knowledge graphs, resolving conflicting hypotheses through decentralized consensus.',
    icon: 'Bot',
    stats: { label: 'Parallel Swarm', value: '128 Agents' },
    badge: 'Swarms v2',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent'
  },
  {
    id: 'feature-4',
    title: 'Self-Healing GraphRAG++ Memory',
    subtitle: 'Continuous Dynamic Knowledge',
    description: 'Automatically detects outdated facts, conflicting edges, and severed dependencies. Continuously rewires and consolidates long-term memory into structured Leiden communities.',
    icon: 'Sparkles',
    stats: { label: 'Recall Accuracy', value: '99.8%' },
    badge: 'Self-Adaptive',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent'
  },
  {
    id: 'feature-5',
    title: 'Autonomous Tool & API Dispatcher',
    subtitle: 'Deterministic Tool Orchestration',
    description: 'Equip agents with 200+ built-in integrations or generate custom OpenAPI tools on the fly. Every execution step is verified against graph type contracts before running.',
    icon: 'Workflow',
    stats: { label: 'Tool Integrations', value: '250+' },
    badge: 'Deterministic',
    gradient: 'from-violet-500/20 via-purple-500/10 to-transparent'
  },
  {
    id: 'feature-6',
    title: 'Enterprise Zero-Trust Cryptographic Vault',
    subtitle: 'SOC2 & HIPAA Compliant Security',
    description: 'Role-based graph partitioning, end-to-end tenant isolation, cryptographic audit trails for every agent decision, and air-gapped on-premise deployment support.',
    icon: 'ShieldCheck',
    stats: { label: 'Security Standard', value: 'SOC2 Type II' },
    badge: 'Enterprise Grade',
    gradient: 'from-rose-500/20 via-pink-500/10 to-transparent'
  }
];

export const INNER_PAGES_SHOWCASE: InnerPageItem[] = [
  {
    id: 'page-builder',
    title: 'Visual Agent Canvas Studio',
    subtitle: 'Drag & Drop Agent Flow Builder',
    description: 'Visual node orchestration canvas with custom condition routers, model selectors, and real-time execution inspectors.',
    badge: 'Studio Suite',
    previewUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80',
    tags: ['Visual Node Editor', 'Real-time Inspector', 'Live Debugger']
  },
  {
    id: 'page-cypher',
    title: 'Graph Query & Cypher Console',
    subtitle: 'Natural Language to GraphQL & Cypher',
    description: 'Convert natural language prompts into optimized multi-hop Cypher queries with instantaneous visual sub-graph highlights.',
    badge: 'Query Engine',
    previewUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=700&q=80',
    tags: ['NL to Cypher', 'GraphQL Subgraphs', 'Cost Optimization']
  },
  {
    id: 'page-swarm',
    title: 'Multi-Agent Swarm Topology Manager',
    subtitle: 'Decentralized Cluster Coordinator',
    description: 'Monitor agent heartbeats, inter-agent message buses, consensus voting logs, and real-time CPU/Token load balancers.',
    badge: 'Swarm Orchestration',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80',
    tags: ['Agent Heartbeats', 'Consensus Logs', 'Load Balancing']
  },
  {
    id: 'page-traces',
    title: 'Execution Trace & Proof Debugger',
    subtitle: 'Step-by-Step Causal Verification',
    description: 'Full deterministic replay of every autonomous decision, tool call payload, reasoning branch, and token consumption profile.',
    badge: 'Observability',
    previewUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=700&q=80',
    tags: ['Causal Replay', 'Token Cost Tracker', 'Latency Flamegraphs']
  }
];

export const INTEGRATIONS_LIST = [
  { name: 'Gemini 2.5 Pro', category: 'LLM Engine', logo: 'Sparkles', color: 'text-blue-400' },
  { name: 'Claude 3.7 Sonnet', category: 'LLM Engine', logo: 'Cpu', color: 'text-amber-400' },
  { name: 'OpenAI GPT-4o', category: 'LLM Engine', logo: 'Zap', color: 'text-emerald-400' },
  { name: 'DeepSeek R1', category: 'Reasoning Engine', logo: 'Brain', color: 'text-cyan-400' },
  { name: 'Neo4j Graph DB', category: 'Graph Storage', logo: 'Database', color: 'text-indigo-400' },
  { name: 'LangGraph', category: 'Framework', logo: 'GitMerge', color: 'text-rose-400' },
  { name: 'Pinecone Vector DB', category: 'Embeddings', logo: 'Boxes', color: 'text-sky-400' },
  { name: 'GitHub Enterprise', category: 'DevOps', logo: 'Code', color: 'text-purple-400' },
  { name: 'Slack & Discord Bots', category: 'Collaboration', logo: 'MessageSquare', color: 'text-teal-400' },
  { name: 'Zapier & Webhooks', category: 'Automation', logo: 'Share2', color: 'text-orange-400' },
  { name: 'PostgreSQL & pgvector', category: 'Database', logo: 'Layers', color: 'text-blue-500' },
  { name: 'Docker & Kubernetes', category: 'Deployment', logo: 'Server', color: 'text-cyan-300' }
];

export const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Ingest & Synthesize Entity Graph',
    subtitle: 'Automatic Ontology Extraction',
    description: 'Connect structured databases, PDFs, APIs, or unorganized web crawls. VivaGraph continuously extracts entities, creates relations, and builds a live semantic topology.',
    icon: 'Database',
    metric: '10M+ triples/hr'
  },
  {
    step: '02',
    title: 'Define Agent Goals & Swarm Roles',
    subtitle: 'Hierarchical Specialization',
    description: 'Assign distinct roles (Researcher, Fact Verifier, Coder, Executioner). The agent swarm coordinates autonomously using the shared graph as ground truth.',
    icon: 'Users',
    metric: 'Zero-config Swarms'
  },
  {
    step: '03',
    title: 'Multi-Hop Visual Reasoning',
    subtitle: 'Deterministic Step Traversal',
    description: 'Watch the agent reason in real-time across high-density graph nodes, testing causal paths, pruning dead ends, and calling external APIs when needed.',
    icon: 'Network',
    metric: '0.2s traversal latency'
  },
  {
    step: '04',
    title: 'Autonomous Action & Continuous Self-Healing',
    subtitle: 'Safe Verified Outputs',
    description: 'Deploy code, trigger external workflows, update databases, or stream interactive visual reports. Feedback loops continuously refine graph edge weights.',
    icon: 'CheckCircle2',
    metric: '99.9% deterministic execution'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Developer Starter',
    tagline: 'Ideal for independent developers and AI researchers experimenting with graph agents.',
    priceMonthly: 29,
    priceAnnual: 24,
    nodeLimit: 'Up to 50,000 Graph Nodes',
    agentsCount: '5 Concurrent Autonomous Agents',
    features: [
      'VivaGraph WebGL Visualizer',
      'Gemini 2.5 Pro & GPT-4o API access',
      'Multi-Hop Graph Reasoning (up to 3 hops)',
      'Community Graph Community Clustering',
      '10 Built-in Tool Integrations',
      'Standard Community Support'
    ],
    ctaText: 'Start Free 14-Day Trial',
    highlighted: false
  },
  {
    id: 'pro-agent',
    name: 'Pro Swarm Studio',
    tagline: 'Engineered for scaling startups and engineering teams deploying autonomous graph workflows.',
    priceMonthly: 99,
    priceAnnual: 79,
    badge: 'MOST POPULAR',
    nodeLimit: 'Up to 1,000,000 Graph Nodes',
    agentsCount: '30 Concurrent Multi-Agent Swarms',
    features: [
      'Everything in Starter, plus:',
      'Deep Multi-Hop Reasoning (Unlimited hops)',
      'Hierarchical Swarm Consensus Arbiter',
      'Real-Time Continuous Self-Healing Memory',
      'Custom OpenAPI & Webhook Tool Creator',
      'Full Execution Trace & Causal Replay',
      'Priority 24/7 Slack Channel Support'
    ],
    ctaText: 'Deploy Pro Agent Swarm',
    highlighted: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Sovereign',
    tagline: 'Mission-critical enterprise infrastructure with dedicated VPC, SOC2 compliance, and air-gapped options.',
    priceMonthly: 399,
    priceAnnual: 319,
    nodeLimit: 'Unlimited Multi-Billion Nodes',
    agentsCount: 'Unlimited Autonomous Swarms',
    features: [
      'Everything in Pro, plus:',
      'Self-Hosted / Air-gapped VPC Deployment',
      'Custom LLM Fine-Tuning on Proprietary Ontologies',
      'Hardware-accelerated Distributed Graph Clusters',
      'SOC2 Type II, HIPAA & GDPR Zero-Trust Vault',
      'Custom SLA with 99.99% Uptime Guarantee',
      'Dedicated Solutions Architect & Live Onboarding'
    ],
    ctaText: 'Contact Enterprise Team',
    highlighted: false
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Dr. Elena Rostova',
    role: 'Head of AI Research',
    company: 'Synapse BioTech Labs',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    content: 'VivaGraph AI transformed our drug discovery pipeline. Traditional RAG kept hallucinating protein binding sites. With VivaGraph’s visual graph reasoning, we mapped 14,000 compound interactions with zero false positives.',
    rating: 5,
    highlight: 'Zero False Positives in 14k Interactions'
  },
  {
    id: 'test-2',
    name: 'Marcus Vance',
    role: 'VP of Engineering',
    company: 'Nexus FinTech Global',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    content: 'The multi-agent swarm orchestration is unbelievable. We replaced 4 separate automation services with a single VivaGraph swarm. Our fraud investigation cycle dropped from 4 hours to 18 seconds.',
    rating: 5,
    highlight: 'Fraud Cycle Down from 4h to 18s'
  },
  {
    id: 'test-3',
    name: 'Sophia Chen',
    role: 'Chief Architect',
    company: 'Aether Cloud Systems',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    content: 'The WebGL graph visualizer effortlessly renders 100k+ node microservice dependencies in 60fps. The UI craftsmanship feels like an ultra-premium command center. It is easily the best AI agent platform of 2026.',
    rating: 5,
    highlight: '60FPS on 100k+ Node Dependencies'
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How is VivaGraph AI different from traditional LLM chains and standard RAG?',
    answer: 'Standard RAG splits documents into arbitrary vector chunks, losing relational context, entity relationships, and causal chains. VivaGraph AI extracts structured knowledge graphs and uses dynamic graph traversal algorithms. This allows the AI agent to execute multi-hop reasoning, prove every intermediate deduction, and eliminate hallucinations.',
    category: 'technical'
  },
  {
    id: 'faq-2',
    question: 'Can I connect my own databases, Neo4j instances, and private vector stores?',
    answer: 'Yes! VivaGraph AI comes with native zero-copy connectors for Neo4j, PostgreSQL (pgvector), Pinecone, Milvus, Qdrant, Memgraph, Snowflake, and AWS Neptune. You can also import standard CSVs, JSON-LD, RDF ontologies, or unstructured PDFs.',
    category: 'integration'
  },
  {
    id: 'faq-3',
    question: 'How does the Multi-Agent Swarm handle conflicts or differing hypotheses?',
    answer: 'VivaGraph uses a Byzantine fault-tolerant consensus protocol. When sub-agents formulate conflicting paths, the consensus arbiter analyzes the probabilistic edge weights and references ground-truth verification subgraphs to converge deterministically on the verified solution.',
    category: 'technical'
  },
  {
    id: 'faq-4',
    question: 'Can VivaGraph AI be deployed on-premise or in an air-gapped environment?',
    answer: 'Yes. Our Enterprise Sovereign edition includes containerized Docker/Kubernetes helm charts and support for local open-weights LLMs (such as DeepSeek R1, Llama 3.3, and Mistral Large) with zero external telemetry or cloud dependencies.',
    category: 'general'
  },
  {
    id: 'faq-5',
    question: 'What is the pricing model for API requests and graph node expansion?',
    answer: 'Our tiers include generous monthly node allocations and concurrent agent execution slots. Additional node bursts and tokens are billed strictly at cost with zero platform markups.',
    category: 'pricing'
  }
];
