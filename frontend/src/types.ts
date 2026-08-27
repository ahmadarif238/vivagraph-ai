export type DemoCategory = 'all' | 'autonomous' | 'graphs' | 'swarms' | 'code' | 'enterprise' | 'analytics';

export interface DemoItem {
  id: string;
  title: string;
  category: DemoCategory;
  categoryLabel: string;
  badge?: 'NEW' | 'HOT' | 'PRO' | 'TRENDING';
  badgeColor?: string;
  description: string;
  image: string;
  nodesCount: number;
  speed: string;
  model: string;
  features: string[];
  demoUrl?: string;
  isPopular?: boolean;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'query' | 'agent' | 'tool' | 'graph' | 'model' | 'action' | 'memory';
  status: 'idle' | 'running' | 'completed' | 'error';
  x: number;
  y: number;
  details: string;
  latency?: string;
  icon?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  active?: boolean;
}

export interface FeatureItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  stats?: { label: string; value: string };
  badge?: string;
  gradient: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  highlight: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  badge?: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
  nodeLimit: string;
  agentsCount: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'pricing' | 'integration';
}

export interface InnerPageItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  previewUrl: string;
  tags: string[];
}
