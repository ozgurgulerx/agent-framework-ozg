export type Demo = {
  id: string;
  title: string;
  description: string;
  route: string;
  badge: string;
  icon: string;
};

export type TimelineEvent = {
  date: string;
  type: 'income' | 'expense' | 'transfer' | 'overdraft' | 'buffer';
  description: string;
  amount: number;
  balance: number;
  time?: string;
};

export type SavingsConfig = {
  persona: string;
  goal: number;
  currency: string;
  timelineStart: string;
  timelineEnd: string;
  currentSavings: number;
  monthsElapsed: number;
  rentDueDay: number;
  rentAmount: number;
  utilitiesDueDay: number;
  utilitiesTime: string;
  utilitiesAmount: number;
  salaryDay: string;
  salaryAmount: number;
  fridayGigIncome: number;
  bnplDueDay: number;
  bnplAmount: number;
  cardAcutDay: number;
  cardADueDay: number;
  cardABalance: number;
  cardBcutDay: number;
  cardBDueDay: number;
  cardBBalance: number;
  gymMembership: number;
  targetBuffer: number;
};

export type StrategyType = 'conventional' | 'reasoning';

export type Strategy = {
  name: string;
  type: StrategyType;
  description: string;
};

export type TimelineSimulation = {
  events: TimelineEvent[];
  kpis: {
    overdrafts: number;
    autosaveCompletion: number;
    goalP50Date: string;
    bufferRange: [number, number];
  };
  advice: string[];
};

export type ModelDiffPoint = {
  category: string;
  conventional: string;
  reasoning: string;
  impact: 'critical' | 'high' | 'medium';
};

export type AdviceTimelinePoint = {
  date: string;
  balance: number;
  label?: string | null;
};

export type AdviceResult = {
  strategy: StrategyType;
  model: string;
  summary: string;
  temporalAwareness: string;
  recommendedActions: string[];
  risks: string[];
  prompt: string;
  raw: string;
  timeline: AdviceTimelinePoint[];
};

export type AdviceComparisonResult = {
  headline: string;
  temporalFactors: string[];
  conventionalGaps: string[];
  reasoningEdge: string[];
  verdict: string;
  confidence: string;
  prompt: string;
  raw: string;
};

export type PortfolioConstraint = {
  id: string;
  type: 'hard' | 'soft';
  category: string;
  rule: string;
  explanation?: string;
  source: {
    doc: string;
    quote: string;
  };
  priority: number;
};

export type PortfolioRunResponse = {
  strategy: StrategyType;
  model: string;
  portfolio: {
    weights: Record<string, number>;
    trades: Array<{
      ticker: string;
      side: 'buy' | 'sell';
      units: number;
      notional_try?: number;
      exec_time?: string;
      settles_on?: string;
    }>;
    rationale: string[];
  };
  validation: {
    passed: string[];
    failed: Array<{ cid: string; reason: string }>;
    score: number;
  };
  plan?: {
    objective?: string;
    key_checks?: Array<{ cid: string; how_to_satisfy: string }>;
    proposed_weights?: Record<string, number>;
    notes?: string[];
  };
  self_check?: {
    by_constraint?: Array<{ cid: string; pass: boolean; explain: string }>;
    all_hard_passed?: boolean;
  };
  prompt: string;
  raw: string;
  constraints: PortfolioConstraint[];
};

export type PortfolioScenario = {
  nav_try: number;
  now_iso: string;
  prices: Record<string, number>;
  holdings_units: Record<string, number>;
  current_weights: Record<string, number>;
  cash_timeline: {
    today_try: number;
    salary: { amount_try: number; at_iso: string };
    rent_due: { amount_try: number; cutoff_iso: string };
    loan_due: { amount_try: number; cutoff_iso: string };
    cash_floor_try: number;
    checkpoints: Array<{ label: string; iso: string }>;
  };
  text_context: Record<string, string>;
};

export type PortfolioDuelInfo = {
  scenario: PortfolioScenario;
  constraints: PortfolioConstraint[];
  prompt: string;
};

export type PortfolioAnalysisResult = {
  headline: string;
  highlights: string[];
  missedConstraints: string[];
  verdict: string;
  prompt: string;
  raw: string;
};

// Rate Swing Types
export type RateSwingCustomer = {
  income_net: number;
  expenses_monthly: number;
  ltv: number;
  lti: number;
  dscr: number;
  term_months: number;
  apr_current: number;
  penalty_rule: string;
  risk_band: string;
  delinquency_12m: number;
};

export type RateSwingKnobs = {
  rate_move_bps: number;
  refix_timing: 'now' | '3m' | '6m';
  competitor_teaser_apr: number;
  competitor_teaser_months: number;
  income_volatility: 'low' | 'medium' | 'high';
};

export type RateSwingScenarioPath = {
  name: string;
  apr_now: number;
  apr_future: number;
  monthly_now: number;
  monthly_3m: number;
  monthly_6m: number;
};

export type RateSwingScenarioSummary = {
  paths: RateSwingScenarioPath[];
  breakeven_month_now_vs_3m: number;
  breakeven_month_now_vs_6m: number;
  constraints: {
    dscr_min: number;
    ltv_cap: number;
    lti_cap: number;
  };
  teaser: {
    apr: number;
    months: number;
  };
};

export type RateSwingDecision = {
  decision: string;
  payment_paths?: Array<{
    scenario: string;
    monthly_now: number;
    monthly_choice: number;
  }>;
  breakeven_month?: number;
  rationale: string[];
  cited_clauses: string[];
  violations: string[];
  disclosures: string[];
  mitigations: string[];
};

export type RateSwingModelResult = {
  model: string;
  json: RateSwingDecision;
  raw: string;
};

export type RateSwingRunResponse = {
  prompt: string;
  scenario_summary: RateSwingScenarioSummary;
  conventional: RateSwingModelResult;
  reasoning: RateSwingModelResult;
};

export type RateSwingAnalysisScorecard = {
  policy_violations_A: number;
  policy_violations_B: number;
  clause_precision_A: number;
  clause_precision_B: number;
  stability_A: number;
  stability_B: number;
};

export type RateSwingAnalysisResult = {
  analysis: {
    winner: string;
    reasons: string[];
    issues_A: string[];
    issues_B: string[];
    scorecard: RateSwingAnalysisScorecard;
  };
  prompt: string;
  raw: string;
};

export type RateSwingInfo = {
  customer: RateSwingCustomer;
  knobs: RateSwingKnobs;
  docs_pack: string;
};
