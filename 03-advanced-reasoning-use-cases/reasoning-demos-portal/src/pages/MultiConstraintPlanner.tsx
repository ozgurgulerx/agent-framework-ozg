import { useEffect, useMemo, useState } from 'react';
import { Loader2, Play, Sparkles, Network, CheckCircle2, XCircle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import type {
  PortfolioAnalysisResult,
  PortfolioConstraint,
  PortfolioDuelInfo,
  PortfolioRunResponse,
  PortfolioScenario,
  StrategyType
} from '../types';
import { analyzePortfolioDuel, fetchPortfolioInfo, runPortfolioModel } from '../lib/api';
import { formatCurrency } from '../lib/utils';

const buildLocalPrompt = (scenario: PortfolioScenario): string => {
  const weightsSummary = JSON.stringify(scenario.current_weights, null, 2);
  const lines = [
    `• Today TRY cash: ${formatCurrency(scenario.cash_timeline.today_try, '₺')}`,
    `• Salary ${formatCurrency(scenario.cash_timeline.salary.amount_try, '₺')} @ ${scenario.cash_timeline.salary.at_iso}`,
    `• Rent ${formatCurrency(scenario.cash_timeline.rent_due.amount_try, '₺')} cutoff ${scenario.cash_timeline.rent_due.cutoff_iso}`,
    `• Loan ${formatCurrency(scenario.cash_timeline.loan_due.amount_try, '₺')} cutoff ${scenario.cash_timeline.loan_due.cutoff_iso}`,
    `• Cash floor ${formatCurrency(scenario.cash_timeline.cash_floor_try, '₺')}; Equity T+2 (holiday Nov 10), Bonds T+1.`
  ];
  const checkpointSummary = lines.join('\n');
  return [
    'Task: Propose a compliant end-of-day portfolio (weights sum to 1) under the constraints below.',
    'Output: JSON only with keys weights, trades, rationale as described. Universe tickers: TR_EQ, GL_EQ, EUR_BOND, GOLD, USD_MM.',
    `Current weights: ${weightsSummary}`,
    'NAV: ₺1,000,000.',
    'Checkpoints & settlement facts:',
    checkpointSummary,
    '',
    'Constraints (HARD unless noted):',
    '- TRY cash ≥ ₺20,000 at now, Nov 10 09:00, Nov 10 17:00, Nov 14 10:30.',
    '- Equity ≤ 55%, Bonds ≥ 20%, GOLD ≤ 15%, each ETF ≤ 25%, TRY exposure ≥ 30%.',
    '- ESG: exclude thermal coal / issuers >10% coal revenue.',
    '- No sells for lots < 365 days; wash-sale 30 days no-repurchase.',
    '- ADV/day ≤ 10%; EUR_BOND min lot ₺5,000; no GL_EQ buys for 3 trading days.',
    '- Equities T+2, Bonds T+1; Nov 10 settlement holiday.',
    '- Trading hours 09:00–17:00; blackout Fri Nov 14 09:45–10:15.',
    '(SOFT) Prefer higher μ with risk awareness; minimize turnover.',
    '',
    'Schema:',
    '{"weights":{"TR_EQ":0.35,"GL_EQ":0.25,"EUR_BOND":0.2,"GOLD":0.1,"USD_MM":0.1},"trades":[{"ticker":"EUR_BOND","side":"buy","units":5000}],"rationale":["bullet 1","bullet 2"]}'
  ].join('\n');
};

const MODEL_LABELS: Record<StrategyType, string> = {
  conventional: 'Conventional · GPT-4o-mini',
  reasoning: 'Reasoning · GPT-5-mini'
};

const STRATEGIES: StrategyType[] = ['conventional', 'reasoning'];

export function MultiConstraintPlanner() {
  const [info, setInfo] = useState<PortfolioDuelInfo | null>(null);
  const [constraints, setConstraints] = useState<PortfolioConstraint[]>([]);
  const [modelResults, setModelResults] = useState<Record<StrategyType, PortfolioRunResponse | null>>({
    conventional: null,
    reasoning: null
  });
  const [modelLoading, setModelLoading] = useState<Record<StrategyType, boolean>>({
    conventional: false,
    reasoning: false
  });
  const [modelError, setModelError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PortfolioAnalysisResult | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolioInfo()
      .then((data) => {
        setInfo(data);
        setConstraints(data.constraints);
      })
      .catch(() => {
        setModelError('Unable to load scenario details.');
      });
  }, []);

  const triggerModel = async (strategy: StrategyType) => {
    setModelError(null);
    setAnalysis(null);
    setAnalysisError(null);
    setModelLoading((prev) => ({ ...prev, [strategy]: true }));
    try {
      const result = await runPortfolioModel(strategy);
      setModelResults((prev) => ({ ...prev, [strategy]: result }));
    } catch (error) {
      setModelError(error instanceof Error ? error.message : 'Portfolio generation failed.');
    } finally {
      setModelLoading((prev) => ({ ...prev, [strategy]: false }));
    }
  };

  const canAnalyze = Boolean(modelResults.conventional && modelResults.reasoning);

  const runAnalysis = async () => {
    if (!modelResults.conventional || !modelResults.reasoning) return;
    setAnalysisError(null);
    setAnalysis(null);
    setAnalysisLoading(true);
    try {
      const result = await analyzePortfolioDuel({
        conventional: modelResults.conventional,
        reasoning: modelResults.reasoning
      });
      setAnalysis(result);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'Analysis failed.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const holdingsList = useMemo(() => {
    if (!info) return [];
    return Object.entries(info.scenario.holdings_units).map(([ticker, units]) => {
      const price = info.scenario.prices[ticker] ?? 0;
      const value = units * price;
      return {
        ticker,
        units,
        value,
        weight: (info.scenario.current_weights[ticker] ?? 0) * 100
      };
    });
  }, [info]);

  const canonicalPrompt = useMemo(() => {
    if (info?.prompt) return info.prompt;
    if (info?.scenario) return buildLocalPrompt(info.scenario);
    return null;
  }, [info]);

  const renderValidation = (result: PortfolioRunResponse | null) => {
    if (!result) {
      return <p className="text-sm text-muted">Run this model to view constraint checks.</p>;
    }
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant={result.validation.score > 0.8 ? 'success' : 'warning'}>
            Score {result.validation.score.toFixed(2)}
          </Badge>
          <span className="text-xs text-muted">Passes {result.validation.passed.length}</span>
        </div>
        <div className="space-y-2">
          {result.validation.failed.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>All tracked constraints satisfied.</span>
            </div>
          ) : (
            result.validation.failed.map((item) => (
              <div key={item.cid} className="flex items-center gap-2 text-sm text-red-300">
                <XCircle className="h-4 w-4" />
                <span>{item.cid}: {item.reason}</span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Header
        title="Multi-constraint Reasoning – Text-constrained Portfolio Duel"
        description="LLM-generated portfolios under liquidity, ESG, timeline, and execution constraints for a ₺1,000,000 TRY mandate."
        breadcrumbs={['Demos', 'Multi-constraint Planning']}
      />
      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scenario</CardTitle>
                <CardDescription>₺1M TRY end-of-day target</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted">
                <div className="flex items-center gap-2 text-text">
                  <Network className="h-4 w-4 text-accent" />
                  <span>Now: {info?.scenario.now_iso ?? '—'}</span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted">Holdings snapshot</p>
                  <div className="mt-2 space-y-1">
                    {holdingsList.map((holding) => (
                      <div key={holding.ticker} className="flex items-center justify-between">
                        <span className="text-text">{holding.ticker}</span>
                        <span>
                          {formatCurrency(holding.value, '₺')} ({holding.weight.toFixed(1)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {info && (
                  <div className="pt-3 border-t border-gray-800 space-y-1">
                    <p className="text-xs uppercase tracking-wide text-muted">Cash timeline</p>
                    <p>Today: {formatCurrency(info.scenario.cash_timeline.today_try, '₺')}</p>
                    <p>Salary: {formatCurrency(info.scenario.cash_timeline.salary.amount_try, '₺')} @ {info.scenario.cash_timeline.salary.at_iso}</p>
                    <p>Rent: {formatCurrency(info.scenario.cash_timeline.rent_due.amount_try, '₺')} cutoff {info.scenario.cash_timeline.rent_due.cutoff_iso}</p>
                    <p>Loan: {formatCurrency(info.scenario.cash_timeline.loan_due.amount_try, '₺')} cutoff {info.scenario.cash_timeline.loan_due.cutoff_iso}</p>
                    <p>Floor: {formatCurrency(info.scenario.cash_timeline.cash_floor_try, '₺')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Constraint Registry</CardTitle>
                <CardDescription>Hard vs soft guardrails surfaced from mandate text.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
                {constraints.map((constraint) => (
                  <div key={constraint.id} className="rounded-lg border border-gray-800 p-3">
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide">
                      <span className="text-text">{constraint.id}</span>
                      <Badge variant={constraint.type === 'hard' ? 'destructive' : 'outline'}>
                        {constraint.type}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-text">
                      {constraint.explanation ?? constraint.rule}
                    </p>
                    <p className="mt-1 text-xs text-muted italic">
                      Constraint: {constraint.rule}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      Source: <span className="text-accent">{constraint.source.doc}</span>
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {canonicalPrompt && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Canonical Prompt</CardTitle>
                  <CardDescription>Exact text sent to GPT-4o-mini and GPT-5-mini.</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="max-h-[360px] overflow-y-auto rounded-lg bg-bg-elev/60 p-3 text-xs leading-relaxed whitespace-pre-wrap">
                    {canonicalPrompt}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Run LLM Portfolios</CardTitle>
                <CardDescription>
                  Each run sends the canonical brief to the selected model and validates the JSON response against constraints.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {modelError && (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {modelError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {STRATEGIES.map((strategy) => (
                    <Button
                      key={strategy}
                      variant={strategy === 'reasoning' ? 'primary' : 'outline'}
                      className="w-full"
                      disabled={modelLoading[strategy]}
                      onClick={() => triggerModel(strategy)}
                    >
                      {modelLoading[strategy] ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="mr-2 h-4 w-4" />
                      )}
                      {MODEL_LABELS[strategy]}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STRATEGIES.map((strategy) => {
                const result = modelResults[strategy];
                return (
                  <Card key={strategy}>
                    <CardHeader>
                      <CardTitle>{MODEL_LABELS[strategy]}</CardTitle>
                      <CardDescription>
                        {result ? 'Latest LLM portfolio' : 'Awaiting generation'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result ? (
                        <>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-muted mb-1">Weights</p>
                            <ul className="space-y-1 text-sm text-muted">
                              {Object.entries(result.portfolio.weights).map(([ticker, weight]) => (
                                <li key={ticker} className="flex items-center justify-between text-text">
                                  <span>{ticker}</span>
                                  <span>{(weight * 100).toFixed(1)}%</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-muted mb-1">Trades</p>
                            {result.portfolio.trades.length === 0 ? (
                              <p className="text-sm text-muted">No trades proposed.</p>
                            ) : (
                              <ul className="space-y-1 text-sm text-muted">
                                {result.portfolio.trades.map((trade, index) => (
                                  <li key={`${trade.ticker}-${index}`} className="flex items-center justify-between">
                                    <span>{trade.side.toUpperCase()} {trade.ticker}</span>
                                    <div className="text-right">
                                      <span className="block">{trade.units.toLocaleString()} units</span>
                                      {trade.notional_try != null && (
                                        <span className="block text-xs text-muted">
                                          ₺{trade.notional_try.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </span>
                                      )}
                                      {(trade.exec_time || trade.settles_on) && (
                                        <span className="block text-[11px] text-muted">
                                          {trade.exec_time ? `Exec ${trade.exec_time}` : ''}
                                          {trade.settles_on ? ` · Settles ${trade.settles_on}` : ''}
                                        </span>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-muted mb-1">Rationale</p>
                            <ul className="list-disc list-inside text-sm text-muted space-y-1">
                              {result.portfolio.rationale.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                          {result.plan && (
                            <div>
                              <p className="text-xs uppercase tracking-wide text-muted mb-1">Plan scratchpad</p>
                              {result.plan.objective && (
                                <p className="text-sm text-text">{result.plan.objective}</p>
                              )}
                              {result.plan.key_checks && result.plan.key_checks.length > 0 && (
                                <ul className="mt-2 space-y-1 text-xs text-muted">
                                  {result.plan.key_checks.map((check, index) => (
                                    <li key={`${check.cid}-${index}`}>
                                      <span className="text-accent">{check.cid}</span>: {check.how_to_satisfy}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {result.plan.notes && result.plan.notes.length > 0 && (
                                <ul className="mt-2 list-disc list-inside text-xs text-muted space-y-1">
                                  {result.plan.notes.map((note, index) => (
                                    <li key={`note-${index}`}>{note}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                          {result.self_check && result.self_check.by_constraint && (
                            <div>
                              <p className="text-xs uppercase tracking-wide text-muted mb-1">Self-check</p>
                              <ul className="space-y-1 text-xs">
                                {result.self_check.by_constraint.map((item, index) => (
                                  <li key={`${item.cid}-${index}`} className="flex items-start gap-2">
                                    {item.pass ? (
                                      <CheckCircle2 className="h-3 w-3 text-green-400 mt-0.5" />
                                    ) : (
                                      <XCircle className="h-3 w-3 text-red-400 mt-0.5" />
                                    )}
                                    <span className="text-muted">
                                      <span className="text-text font-semibold">{item.cid}</span>: {item.explain}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              {result.self_check.all_hard_passed === false && (
                                <p className="mt-2 text-xs text-red-400">Model self-check flagged a hard constraint.</p>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-muted">No submission yet.</p>
                      )}
                      <div className="pt-3 border-t border-gray-800">
                        <p className="text-xs uppercase tracking-wide text-muted mb-2">Validation</p>
                        {renderValidation(result)}
                      </div>
                      {result && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-accent">View JSON exchange</summary>
                          <div className="mt-2 space-y-2">
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-muted">Prompt</p>
                              <pre className="max-h-32 overflow-y-auto rounded-md bg-bg-elev/60 p-2 text-[11px] leading-snug whitespace-pre-wrap">
                                {result.prompt}
                              </pre>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-muted">Raw response</p>
                              <pre className="max-h-32 overflow-y-auto rounded-md bg-bg-elev/60 p-2 text-[11px] leading-snug whitespace-pre-wrap">
                                {result.raw}
                              </pre>
                            </div>
                          </div>
                        </details>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader className="gap-4 md:flex md:items-start md:justify-between">
                <div>
                  <CardTitle>Constraint Analysis</CardTitle>
                  <CardDescription>
                    GPT-5-mini inspects both portfolios and flags missed constraints.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  disabled={!canAnalyze || analysisLoading}
                  onClick={runAnalysis}
                >
                  {analysisLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Compare models
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisError && (
                  <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    {analysisError}
                  </div>
                )}
                {!analysis && !analysisLoading && (
                  <p className="text-sm text-muted">
                    Run both models, then trigger the comparison to get a narrated constraints audit.
                  </p>
                )}
                {analysis && (
                  <>
                    <div>
                      <p className="text-base font-semibold text-text">{analysis.headline}</p>
                      <p className="mt-1 text-sm text-muted">{analysis.verdict}</p>
                    </div>
                    {analysis.highlights?.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted mb-1">Highlights</p>
                        <ul className="list-disc list-inside text-sm text-muted space-y-1">
                          {analysis.highlights.map((item, index) => (
                            <li key={`hl-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysis.missedConstraints?.length > 0 && (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted mb-1">Missed constraints</p>
                        <ul className="list-disc list-inside text-sm text-red-300 space-y-1">
                          {analysis.missedConstraints.map((item, index) => (
                            <li key={`miss-${index}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <details className="text-xs">
                      <summary className="cursor-pointer text-accent">View GPT-5 call</summary>
                      <div className="mt-2 space-y-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-muted">Prompt</p>
                          <pre className="max-h-32 overflow-y-auto rounded-md bg-bg-elev/60 p-2 text-[11px] leading-snug whitespace-pre-wrap">
                            {analysis.prompt}
                          </pre>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-muted">Raw response</p>
                          <pre className="max-h-32 overflow-y-auto rounded-md bg-bg-elev/60 p-2 text-[11px] leading-snug whitespace-pre-wrap">
                            {analysis.raw}
                          </pre>
                        </div>
                      </div>
                    </details>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
