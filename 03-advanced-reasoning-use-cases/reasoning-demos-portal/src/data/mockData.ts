import type { SavingsConfig, Demo, ModelDiffPoint } from '../types';

export const demos: Demo[] = [
  {
    id: 'temporal-savings',
    title: 'Temporal Reasoning – Personal Savings Coach',
    description: 'Calendar-aware financial planning with timing constraints, buffer management, and goal optimization.',
    route: '/temporal-savings-coach',
    badge: 'Reasoning',
    icon: 'calendar-clock'
  },
  {
    id: 'multi-constraint',
    title: 'Multi-constraint Reasoning & Planning',
    description: 'Complex payment scheduling under fees, limits, cut-off windows, and user preferences.',
    route: '/multi-constraint-planner',
    badge: 'Planning',
    icon: 'network'
  },
  {
    id: 'what-if',
    title: 'What-if Simulations',
    description: 'Scenario analysis with salary delays, expense spikes, bonuses, and impact visualization.',
    route: '/what-if-simulations',
    badge: 'Simulation',
    icon: 'git-branch'
  },
  {
    id: 'empathetic',
    title: 'Empathetic Communication',
    description: 'Tone-aware responses that preserve user values while delivering financial guidance.',
    route: '/empathetic-communication',
    badge: 'Communication',
    icon: 'heart-handshake'
  },
  {
    id: 'negotiation',
    title: 'Social Negotiation',
    description: 'Payment plan renegotiation with BNPL providers and card issuers for better terms.',
    route: '/social-negotiation',
    badge: 'Negotiation',
    icon: 'helping-hand'
  },
  {
    id: 'recommender',
    title: 'Advanced Recommender Systems',
    description: 'Temporal-threshold card/offer selection with explainability and trade-off analysis.',
    route: '/advanced-recommenders',
    badge: 'Recommendation',
    icon: 'sparkles'
  }
];

export const emreConfig: SavingsConfig = {
  persona: 'Emre (İstanbul)',
  goal: 60000,
  currency: '₺',
  timelineStart: '2025-01-01',
  timelineEnd: '2026-04-30',
  currentSavings: 12000,
  monthsElapsed: 6,
  rentDueDay: 10,
  rentAmount: 8500,
  utilitiesDueDay: 10,
  utilitiesTime: '05:00',
  utilitiesAmount: 850,
  salaryDay: 'last-business-day',
  salaryAmount: 28000,
  fridayGigIncome: 2500,
  bnplDueDay: 15,
  bnplAmount: 1200,
  cardAcutDay: 20,
  cardADueDay: 1,
  cardABalance: 6500,
  cardBcutDay: 25,
  cardBDueDay: 5,
  cardBBalance: 4200,
  gymMembership: 450,
  targetBuffer: 3000
};

export const modelDiffPoints: ModelDiffPoint[] = [
  {
    category: 'Calendar Rules',
    conventional: 'Ignores that utilities debit at 05:00 on the 10th - may schedule rent same day causing overdraft',
    reasoning: 'Recognizes 05:00 timing, ensures rent payment happens Monday 10:30 after payroll clears',
    impact: 'critical'
  },
  {
    category: 'Weekend Handling',
    conventional: 'Attempts rent payment on weekend when bank is closed, causing delays and penalties',
    reasoning: 'Adjusts rent to next business day (Monday) and times it after salary deposit',
    impact: 'critical'
  },
  {
    category: 'Buffer Management',
    conventional: 'No buffer concept - uses percentage-based saving regardless of upcoming obligations',
    reasoning: 'Maintains 7-day buffer (₺3k) before allocating to savings, preventing overdrafts',
    impact: 'high'
  },
  {
    category: 'Income Allocation',
    conventional: 'Simple 15% auto-save from salary without considering payment schedule',
    reasoning: 'T+1 allocation: buffer first, then strategic savings only if buffer healthy',
    impact: 'high'
  },
  {
    category: 'Gig Income Strategy',
    conventional: 'No systematic approach to irregular Friday income',
    reasoning: '50% to savings, 50% to buffer/discretionary - consistent and goal-aligned',
    impact: 'medium'
  },
  {
    category: 'Credit Card Optimization',
    conventional: 'Always pays minimum (10%) regardless of available funds',
    reasoning: 'Full payoff when buffer permits, avoiding interest charges and improving credit',
    impact: 'high'
  },
  {
    category: 'Month-end Sweep',
    conventional: 'No mechanism to capture excess buffer',
    reasoning: 'If 7-day buffer exceeded, sweeps excess to savings for goal acceleration',
    impact: 'medium'
  },
  {
    category: 'Adherence to Values',
    conventional: 'Generic advice that may suggest cutting gym or social activities',
    reasoning: 'Preserves gym membership as stated non-negotiable, optimizes around it',
    impact: 'high'
  }
];
