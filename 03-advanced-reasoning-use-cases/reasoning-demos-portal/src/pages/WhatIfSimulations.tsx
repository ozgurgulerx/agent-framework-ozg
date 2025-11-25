import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Loader2, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Header } from '../components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import type {
  RateSwingInfo,
  RateSwingKnobs,
  RateSwingRunResponse,
  RateSwingAnalysisResult,
  RateSwingCustomer
} from '../types';
import { fetchRateSwingInfo, runRateSwingSimulation, analyzeRateSwingResults } from '../lib/api';
import { formatCurrency } from '../lib/utils';

const MODEL_LABELS = {
  conventional: 'Conventional · GPT-4o-mini',
  reasoning: 'Reasoning · GPT-5-mini'
};

export function WhatIfSimulations() {
  const [info, setInfo] = useState<RateSwingInfo | null>(null);
  const [customer, setCustomer] = useState<RateSwingCustomer | null>(null);
  const [knobs, setKnobs] = useState<RateSwingKnobs | null>(null);
  const [docsPack, setDocsPack] = useState<string>('');

  const [results, setResults] = useState<RateSwingRunResponse | null>(null);
  const [analysis, setAnalysis] = useState<RateSwingAnalysisResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [showPrompt, setShowPrompt] = useState(false);
  const [showAnalysisPrompt, setShowAnalysisPrompt] = useState(false);

  useEffect(() => {
    fetchRateSwingInfo()
      .then((data) => {
        setInfo(data);
        setCustomer(data.customer);
        setKnobs(data.knobs);
        setDocsPack(data.docs_pack);
      })
      .catch(() => {
        setError('Unable to load scenario details.');
      });
  }, []);

  const runSimulation = async () => {
    if (!customer || !knobs) return;

    setError(null);
    setAnalysis(null);
    setAnalysisError(null);
    setLoading(true);

    try {
      const result = await runRateSwingSimulation(customer, knobs, docsPack);
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    if (!results) return;

    setAnalysisError(null);
    setAnalysisLoading(true);

    try {
      const analysisResult = await analyzeRateSwingResults(
        results.prompt,
        results.scenario_summary,
        docsPack,
        results.conventional.json,
        results.reasoning.json
      );
      setAnalysis(analysisResult);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : 'Analysis failed.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const chartData = results?.scenario_summary.paths.map(path => ({
    scenario: path.name,
    'Now': path.monthly_now,
    '3 Months': path.monthly_3m,
    '6 Months': path.monthly_6m
  })) || [];

  const renderDecisionCard = (
    title: string,
    model: string,
    decision: any,
    raw: string
  ) => {
    if (!decision) return null;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge variant="outline">{model}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Decision */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold text-text">Decision</span>
            </div>
            <Badge variant="default" className="text-base px-4 py-2">
              {decision.decision || 'N/A'}
            </Badge>
          </div>

          {/* Rationale */}
          {decision.rationale && decision.rationale.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-text mb-2">Rationale</p>
              <ul className="space-y-1 text-sm text-muted">
                {decision.rationale.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cited Clauses */}
          {decision.cited_clauses && decision.cited_clauses.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-text mb-2">Cited Clauses</p>
              <div className="flex flex-wrap gap-2">
                {decision.cited_clauses.map((clause: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {clause}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Violations */}
          {decision.violations && decision.violations.length > 0 && (
            <div className="rounded-lg border border-red-900/20 bg-red-950/10 p-3">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-red-400" />
                <span className="text-sm font-semibold text-red-300">Violations</span>
              </div>
              <ul className="space-y-1 text-sm text-red-300">
                {decision.violations.map((item: string, idx: number) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclosures */}
          {decision.disclosures && decision.disclosures.length > 0 && (
            <div className="rounded-lg border border-gray-800 bg-bg-elev p-3">
              <p className="text-xs font-semibold text-muted mb-2">Required Disclosures</p>
              <div className="space-y-1 text-xs text-muted italic">
                {decision.disclosures.map((item: string, idx: number) => (
                  <p key={idx}>"{item}"</p>
                ))}
              </div>
            </div>
          )}

          {/* Raw JSON */}
          <details className="text-xs">
            <summary className="cursor-pointer text-muted hover:text-text">
              View Raw JSON
            </summary>
            <pre className="mt-2 p-3 bg-bg-elev rounded-lg overflow-x-auto text-xs text-muted">
              {raw}
            </pre>
          </details>
        </CardContent>
      </Card>
    );
  };

  const renderScorecard = () => {
    if (!analysis) return null;

    const scorecard = analysis.analysis.scorecard;

    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted">GPT-4o-mini</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Policy Violations</span>
              <Badge variant={scorecard.policy_violations_A === 0 ? 'success' : 'destructive'}>
                {scorecard.policy_violations_A}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Clause Precision</span>
              <Badge variant={scorecard.clause_precision_A >= 0.8 ? 'success' : 'warning'}>
                {(scorecard.clause_precision_A * 100).toFixed(0)}%
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Stability</span>
              <Badge variant={scorecard.stability_A >= 0.8 ? 'success' : 'warning'}>
                {(scorecard.stability_A * 100).toFixed(0)}%
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted">GPT-5-mini</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Policy Violations</span>
              <Badge variant={scorecard.policy_violations_B === 0 ? 'success' : 'destructive'}>
                {scorecard.policy_violations_B}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Clause Precision</span>
              <Badge variant={scorecard.clause_precision_B >= 0.8 ? 'success' : 'warning'}>
                {(scorecard.clause_precision_B * 100).toFixed(0)}%
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Stability</span>
              <Badge variant={scorecard.stability_B >= 0.8 ? 'success' : 'warning'}>
                {(scorecard.stability_B * 100).toFixed(0)}%
              </Badge>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header
        title="What-if Simulations – Rate-Swing Mortgage Refix Coach"
        description="Fair comparison: Both models receive identical instructions. Only difference: GPT-5-mini uses reasoning_effort='high'"
        breadcrumbs={['Demos', 'What-if Simulations']}
      />

      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl">
          {/* Left Column: Configuration */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Profile</CardTitle>
                <CardDescription>Mortgage parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {customer && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted">Net Income</span>
                      <span className="text-text">{formatCurrency(customer.income_net, '₺')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Monthly Expenses</span>
                      <span className="text-text">{formatCurrency(customer.expenses_monthly, '₺')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">LTV</span>
                      <span className="text-text">{(customer.ltv * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">LTI</span>
                      <span className="text-text">{customer.lti.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">DSCR</span>
                      <span className="text-text">{customer.dscr.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Current APR</span>
                      <span className="text-text">{customer.apr_current}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Term</span>
                      <span className="text-text">{customer.term_months} months</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scenario Knobs</CardTitle>
                <CardDescription>What-if parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {knobs && (
                  <>
                    <div>
                      <label className="text-sm text-muted mb-2 block">
                        Rate Move: {knobs.rate_move_bps} bps
                      </label>
                      <input
                        type="range"
                        min="-100"
                        max="300"
                        step="25"
                        value={knobs.rate_move_bps}
                        onChange={(e) =>
                          setKnobs({ ...knobs, rate_move_bps: parseInt(e.target.value) })
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-muted mb-2 block">Refix Timing</label>
                      <select
                        value={knobs.refix_timing}
                        onChange={(e) =>
                          setKnobs({
                            ...knobs,
                            refix_timing: e.target.value as 'now' | '3m' | '6m'
                          })
                        }
                        className="w-full bg-bg-elev border border-gray-800 rounded-lg px-3 py-2 text-sm text-text"
                      >
                        <option value="now">Now</option>
                        <option value="3m">3 Months</option>
                        <option value="6m">6 Months</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-muted mb-2 block">
                        Competitor Teaser APR: {knobs.competitor_teaser_apr}%
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={knobs.competitor_teaser_apr}
                        onChange={(e) =>
                          setKnobs({
                            ...knobs,
                            competitor_teaser_apr: parseFloat(e.target.value)
                          })
                        }
                        className="w-full bg-bg-elev border border-gray-800 rounded-lg px-3 py-2 text-sm text-text"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-muted mb-2 block">Income Volatility</label>
                      <select
                        value={knobs.income_volatility}
                        onChange={(e) =>
                          setKnobs({
                            ...knobs,
                            income_volatility: e.target.value as 'low' | 'medium' | 'high'
                          })
                        }
                        className="w-full bg-bg-elev border border-gray-800 rounded-lg px-3 py-2 text-sm text-text"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </>
                )}

                <Button
                  onClick={runSimulation}
                  disabled={loading || !customer || !knobs}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run What-If
                    </>
                  )}
                </Button>

                {error && (
                  <div className="text-sm text-red-400 mt-2">{error}</div>
                )}
              </CardContent>
            </Card>

            {/* Docs Pack */}
            {docsPack && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Policy Documents</CardTitle>
                  <CardDescription>Available clause references</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs text-muted whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {docsPack}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Center Column: Charts and Results */}
          <div className="lg:col-span-2 space-y-6">
            {results && (
              <>
                {/* Payment Comparison Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Scenarios</CardTitle>
                    <CardDescription>
                      Monthly payments under different rate stress scenarios
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="scenario" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1a1a1a',
                              border: '1px solid #333'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="Now" fill="#6366f1" />
                          <Bar dataKey="3 Months" fill="#8b5cf6" />
                          <Bar dataKey="6 Months" fill="#a855f7" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Breakeven Info */}
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="rounded-lg border border-gray-800 p-3">
                        <p className="text-xs text-muted mb-1">Breakeven: Now vs 3m</p>
                        <p className="text-lg font-semibold text-accent">
                          {results.scenario_summary.breakeven_month_now_vs_3m} months
                        </p>
                      </div>
                      <div className="rounded-lg border border-gray-800 p-3">
                        <p className="text-xs text-muted mb-1">Breakeven: Now vs 6m</p>
                        <p className="text-lg font-semibold text-accent">
                          {results.scenario_summary.breakeven_month_now_vs_6m} months
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comparison Info Banner */}
                <Card className="bg-gradient-to-r from-blue-950/20 to-purple-950/20 border-blue-900/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-text mb-1">
                          Fair Comparison Setup
                        </h3>
                        <p className="text-xs text-muted leading-relaxed">
                          Both models received <strong>identical system instructions and prompts</strong>.
                          The <strong>only difference</strong> is that GPT-5-mini uses <code className="px-1 py-0.5 bg-bg-elev rounded text-accent">reasoning_effort="high"</code> to enable extended reasoning capabilities.
                          This lets us see if the reasoning mode truly improves decision quality.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Model Decisions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderDecisionCard(
                    'GPT-4o-mini (baseline)',
                    MODEL_LABELS.conventional,
                    results.conventional.json,
                    results.conventional.raw
                  )}
                  {renderDecisionCard(
                    'GPT-5-mini (reasoning_effort=high)',
                    MODEL_LABELS.reasoning,
                    results.reasoning.json,
                    results.reasoning.raw
                  )}
                </div>

                {/* Comparison Analysis */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Model Comparison</CardTitle>
                        <CardDescription>
                          GPT-5-mini analysis of both outputs
                        </CardDescription>
                      </div>
                      <Button
                        onClick={runAnalysis}
                        disabled={analysisLoading || !!analysis}
                        variant="outline"
                        size="sm"
                      >
                        {analysisLoading ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-3 w-3" />
                            {analysis ? 'Analysis Complete' : 'Analyze Outputs'}
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysisError && (
                      <div className="text-sm text-red-400">{analysisError}</div>
                    )}

                    {analysis && (
                      <>
                        {/* Winner */}
                        <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-5 w-5 text-accent" />
                            <span className="font-semibold text-text">
                              Winner: {analysis.analysis.winner}
                            </span>
                          </div>
                          <ul className="space-y-1 text-sm text-muted">
                            {analysis.analysis.reasons.map((reason, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-accent mt-0.5">•</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Scorecard */}
                        {renderScorecard()}

                        {/* Issues */}
                        {(analysis.analysis.issues_A.length > 0 ||
                          analysis.analysis.issues_B.length > 0) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {analysis.analysis.issues_A.length > 0 && (
                              <div className="rounded-lg border border-gray-800 p-3">
                                <p className="text-sm font-semibold text-muted mb-2">
                                  GPT-4o-mini Issues
                                </p>
                                <ul className="space-y-1 text-sm text-muted">
                                  {analysis.analysis.issues_A.map((issue, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                      <span>{issue}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {analysis.analysis.issues_B.length > 0 && (
                              <div className="rounded-lg border border-gray-800 p-3">
                                <p className="text-sm font-semibold text-muted mb-2">
                                  GPT-5-mini Issues
                                </p>
                                <ul className="space-y-1 text-sm text-muted">
                                  {analysis.analysis.issues_B.map((issue, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                      <span>{issue}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Analysis Prompt */}
                        <details>
                          <summary className="text-sm text-muted hover:text-text cursor-pointer flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            View Analysis Prompt
                          </summary>
                          <pre className="mt-2 p-4 bg-bg-elev rounded-lg overflow-x-auto text-xs text-muted max-h-96">
                            {analysis.prompt}
                          </pre>
                        </details>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Prompt Display */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Canonical Prompt</CardTitle>
                    <CardDescription>
                      Exact text sent to both GPT-4o-mini and GPT-5-mini
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="p-4 bg-bg-elev rounded-lg overflow-x-auto text-xs text-muted max-h-96 whitespace-pre-wrap">
                      {results.prompt}
                    </pre>
                  </CardContent>
                </Card>
              </>
            )}

            {!results && !loading && (
              <Card className="bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-accent" />
                  </div>
                  <p className="text-muted">
                    Configure the scenario parameters and click "Run What-If" to start the
                    simulation
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
