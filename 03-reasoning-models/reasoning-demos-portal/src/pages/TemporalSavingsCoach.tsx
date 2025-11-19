import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Download, FileJson, Loader2, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Header } from '../components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { emreConfig } from '../data/mockData';
import { simulateConventionalStrategy, simulateReasoningStrategy } from '../lib/timelineSimulator';
import { formatCurrency } from '../lib/utils';
import type {
  AdviceComparisonResult,
  AdviceResult,
  AdviceTimelinePoint,
  StrategyType,
  TimelineSimulation
} from '../types';
import { useAppStore } from '../stores/appStore';
import { fetchSavingsAdvice, fetchTemporalAnalysis } from '../lib/api';

type ActiveStrategy = StrategyType | null;
type AdviceState = Record<StrategyType, AdviceResult | null>;
type AdviceLoadingState = Record<StrategyType, boolean>;

const STRATEGY_ORDER: StrategyType[] = ['conventional', 'reasoning'];
const MODEL_LABELS: Record<StrategyType, string> = {
  conventional: 'Conventional · GPT-4o-mini',
  reasoning: 'Reasoning · GPT-5-mini'
};
const STRATEGY_BADGE: Record<StrategyType, string> = {
  conventional: 'Baseline heuristics',
  reasoning: 'Temporal reasoning'
};
const STRATEGY_HELPER: Record<StrategyType, string> = {
  conventional: 'Focuses on simple percentages and fixed schedules.',
  reasoning: 'Understands buffers, cut-offs, and ordering.'
};

export function TemporalSavingsCoach() {
  const [activeStrategy, setActiveStrategy] = useState<ActiveStrategy>(null);
  const [simulation, setSimulation] = useState<TimelineSimulation | null>(null);
  const { setModelDiffOpen } = useAppStore();
  const [modelAdvice, setModelAdvice] = useState<AdviceState>({
    conventional: null,
    reasoning: null
  });
  const [adviceLoading, setAdviceLoading] = useState<AdviceLoadingState>({
    conventional: false,
    reasoning: false
  });
  const [adviceError, setAdviceError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AdviceComparisonResult | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const fetchAdviceForStrategy = async (strategy: StrategyType) => {
    setAdviceError(null);
    setAdviceLoading(prev => ({ ...prev, [strategy]: true }));
    try {
      const adviceResult = await fetchSavingsAdvice(strategy, emreConfig);
      setModelAdvice(prev => ({ ...prev, [strategy]: adviceResult }));
    } catch (error) {
      setAdviceError(error instanceof Error ? error.message : 'Unable to fetch savings advice.');
    } finally {
      setAdviceLoading(prev => ({ ...prev, [strategy]: false }));
    }
  };

  const runSimulation = async (strategy: ActiveStrategy) => {
    if (!strategy) return;

    setAnalysis(null);
    setAnalysisError(null);
    setActiveStrategy(strategy);
    const result = strategy === 'conventional'
      ? simulateConventionalStrategy(emreConfig)
      : simulateReasoningStrategy(emreConfig);

    setSimulation(result);
    await fetchAdviceForStrategy(strategy);
  };

  const explainTemporalEdge = async () => {
    if (!modelAdvice.conventional || !modelAdvice.reasoning) return;
    setAnalysisError(null);
    setAnalysisLoading(true);
    try {
      const comparison = await fetchTemporalAnalysis(
        modelAdvice.conventional,
        modelAdvice.reasoning,
        emreConfig
      );
      setAnalysis(comparison);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'Unable to fetch temporal analysis.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const resetDemo = () => {
    setActiveStrategy(null);
    setSimulation(null);
    setModelAdvice({
      conventional: null,
      reasoning: null
    });
    setAdviceError(null);
    setAnalysis(null);
    setAnalysisError(null);
    setAnalysisLoading(false);
  };

  const exportJSON = () => {
    if (!simulation) return;
    const dataStr = JSON.stringify({ config: emreConfig, simulation }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `savings-simulation-${activeStrategy}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const hasBothAdvice = Boolean(modelAdvice.conventional && modelAdvice.reasoning);

  const simulationChartData = simulation?.events
    .filter((_, index) => index % 7 === 0)
    .map(event => ({
      date: event.date.split('-').slice(1).join('/'), // MM/DD format
      balance: event.balance,
      type: event.type
    })) || [];

  const formatTimelineDate = (date: string) => {
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return date;
  };

  const llmTimeline: AdviceTimelinePoint[] = activeStrategy
    ? (modelAdvice[activeStrategy]?.timeline ?? [])
    : [];

  const timelineChartData = llmTimeline.length > 0
    ? llmTimeline.map(point => ({
      date: formatTimelineDate(point.date),
      balance: point.balance,
      label: point.label
    }))
    : simulationChartData;

  const usingLLMTimeline = llmTimeline.length > 0;

  return (
    <>
      <Header
        title="Temporal Reasoning – Personal Savings Coach"
        description="Calendar-aware financial planning with timing constraints, buffer management, and goal optimization"
        breadcrumbs={['Demos', 'Temporal Reasoning']}
      />

      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl">
          {/* Left Column: Config Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Persona</CardTitle>
                <CardDescription>Pre-configured scenario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-text">{emreConfig.persona}</p>
                  <p className="text-xs text-muted mt-1">
                    Goal: {formatCurrency(emreConfig.goal)} by Apr 30, 2026
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-800">
                  <p className="text-xs text-muted mb-2">Current Progress</p>
                  <div className="bg-bg-elev rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-accent h-full"
                      style={{ width: `${(emreConfig.currentSavings / emreConfig.goal) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted">
                      {formatCurrency(emreConfig.currentSavings)} saved
                    </span>
                    <span className="text-xs text-muted">
                      {formatCurrency(emreConfig.goal - emreConfig.currentSavings)} to go
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Constraints</CardTitle>
                <CardDescription>Financial obligations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Rent (10th):</span>
                  <span className="text-text font-medium">{formatCurrency(emreConfig.rentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Utilities (10th 05:00):</span>
                  <span className="text-text font-medium">{formatCurrency(emreConfig.utilitiesAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Salary (last biz day):</span>
                  <span className="text-green-400 font-medium">+{formatCurrency(emreConfig.salaryAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Friday gig:</span>
                  <span className="text-green-400 font-medium">+{formatCurrency(emreConfig.fridayGigIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">BNPL (15th):</span>
                  <span className="text-text font-medium">{formatCurrency(emreConfig.bnplAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Card A balance:</span>
                  <span className="text-yellow-400 font-medium">{formatCurrency(emreConfig.cardABalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Card B balance:</span>
                  <span className="text-yellow-400 font-medium">{formatCurrency(emreConfig.cardBBalance)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Run Simulation</CardTitle>
                <CardDescription>Compare strategies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant={activeStrategy === 'conventional' ? 'primary' : 'outline'}
                  className="w-full"
                  onClick={() => void runSimulation('conventional')}
                  disabled={adviceLoading.conventional}
                >
                  {adviceLoading.conventional ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {MODEL_LABELS.conventional}
                </Button>
                <Button
                  variant={activeStrategy === 'reasoning' ? 'primary' : 'outline'}
                  className="w-full"
                  onClick={() => void runSimulation('reasoning')}
                  disabled={adviceLoading.reasoning}
                >
                  {adviceLoading.reasoning ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {MODEL_LABELS.reasoning}
                </Button>

                <div className="pt-3 border-t border-gray-800 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={resetDemo}
                    disabled={!simulation}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setModelDiffOpen(true)}
                  >
                    Show Diff
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {!simulation ? (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted mb-2">No simulation running</p>
                  <p className="text-sm text-muted">
                    Select a strategy to see results
                  </p>
                </div>
              </Card>
            ) : (
              <>
                {/* KPIs */}
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-xs text-muted uppercase tracking-wide">Overdrafts</p>
                      <p className={`text-3xl font-bold mt-2 ${
                        simulation.kpis.overdrafts > 0 ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {simulation.kpis.overdrafts}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-xs text-muted uppercase tracking-wide">Goal Progress</p>
                      <p className="text-3xl font-bold mt-2 text-text">
                        {simulation.kpis.autosaveCompletion.toFixed(0)}%
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-xs text-muted uppercase tracking-wide">Buffer Range</p>
                      <p className="text-lg font-bold mt-2 text-text">
                        {formatCurrency(simulation.kpis.bufferRange[0], '₺')} -<br/>
                        {formatCurrency(simulation.kpis.bufferRange[1], '₺')}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-xs text-muted uppercase tracking-wide">Goal P50</p>
                      <p className="text-sm font-bold mt-2 text-text leading-tight">
                        {simulation.kpis.goalP50Date}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline Chart */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Balance Timeline</CardTitle>
                        <CardDescription className="mt-1">
                          {usingLLMTimeline
                            ? 'LLM-generated checkpoints based on the latest model advice'
                            : 'Daily balance projection (sampled weekly)'}
                        </CardDescription>
                      </div>
                      <Badge variant={usingLLMTimeline ? 'success' : activeStrategy === 'reasoning' ? 'success' : 'warning'}>
                        {usingLLMTimeline ? 'LLM Timeline' : activeStrategy === 'reasoning' ? 'Reasoning' : 'Conventional'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={timelineChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis
                          dataKey="date"
                          stroke="#9aa4b2"
                          tick={{ fill: '#9aa4b2', fontSize: 12 }}
                        />
                        <YAxis
                          stroke="#9aa4b2"
                          tick={{ fill: '#9aa4b2', fontSize: 12 }}
                          tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#122038',
                            border: '1px solid #1f2937',
                            borderRadius: '0.5rem',
                            color: '#e5e7eb'
                          }}
                          formatter={(value: number, _name: string, props) => {
                            const contextualLabel = props?.payload?.label;
                            return [formatCurrency(value), contextualLabel || 'Balance'];
                          }}
                          labelFormatter={(label) => `Checkpoint: ${label}`}
                        />
                        <Legend wrapperStyle={{ color: '#9aa4b2' }} />
                        <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
                        <ReferenceLine y={emreConfig.targetBuffer} stroke="#3b82f6" strokeDasharray="3 3" label="Target Buffer" />
                        <Line
                          type="monotone"
                          dataKey="balance"
                          stroke={activeStrategy === 'reasoning' ? '#10b981' : '#f59e0b'}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* LLM Advisory */}
                <Card>
                  <CardHeader>
                    <CardTitle>LLM Savings Advisory</CardTitle>
                    <CardDescription>
                      Live responses comparing GPT-4o-mini heuristics with GPT-5-mini temporal reasoning.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {adviceError && (
                      <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                        {adviceError}
                      </div>
                    )}
                    <div className="mb-4 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs leading-relaxed text-accent">
                      Emre faces a rent + utilities double-hit on the 10th (utilities at 05:00) while salary only clears on the last business day and a ₺3k buffer must stay intact. Baseline GPT-4o-mini leans on fixed percentages; GPT-5-mini is expected to reorder cash movements around timing windows.
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {STRATEGY_ORDER.map((strategy) => {
                        const result = modelAdvice[strategy];
                        const isLoading = adviceLoading[strategy];
                        const modelName = MODEL_LABELS[strategy];
                        return (
                          <div
                            key={strategy}
                            className="flex flex-col rounded-xl border border-gray-800 bg-bg-elev/30 p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-[11px] uppercase tracking-wide text-muted">
                                  {STRATEGY_BADGE[strategy]}
                                </p>
                                <p className="text-sm font-semibold text-text">{modelName}</p>
                                <p className="text-[11px] text-muted mt-1">{STRATEGY_HELPER[strategy]}</p>
                              </div>
                              <Badge variant={strategy === 'reasoning' ? 'success' : 'outline'}>
                                {strategy === 'reasoning' ? 'Temporal' : 'Baseline'}
                              </Badge>
                            </div>

                            {isLoading && (
                              <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Calling {modelName.split('·')[1]?.trim() || modelName}…
                              </div>
                            )}

                            {!isLoading && !result && (
                              <p className="mt-4 text-sm text-muted">
                                Run {modelName} to capture this model&apos;s advisory output.
                              </p>
                            )}

                            {result && (
                              <div className="mt-4 space-y-4 text-sm text-muted">
                                <div>
                                  <p className="text-[11px] uppercase tracking-wide text-muted">Summary</p>
                                  <p className="text-text">{result.summary}</p>
                                </div>
                                <div>
                                  <p className="text-[11px] uppercase tracking-wide text-muted">Temporal Awareness</p>
                                  <p
                                    className={`text-text ${
                                      strategy === 'reasoning' ? 'text-green-300' : ''
                                    }`}
                                  >
                                    {result.temporalAwareness}
                                  </p>
                                </div>
                                {result.recommendedActions.length > 0 && (
                                  <div>
                                    <p className="text-[11px] uppercase tracking-wide text-muted">Recommended Moves</p>
                                    <ul className="list-disc list-inside space-y-1">
                                      {result.recommendedActions.map((action, index) => (
                                        <li key={index}>{action}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {result.risks.length > 0 && (
                                  <div>
                                    <p className="text-[11px] uppercase tracking-wide text-muted">Risks / Gaps</p>
                                    <ul className="list-disc list-inside space-y-1">
                                      {result.risks.map((risk, index) => (
                                        <li key={index}>{risk}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                <details className="text-xs">
                                  <summary className="cursor-pointer text-accent">View model call</summary>
                                  <div className="mt-2 space-y-2">
                                    <div>
                                      <p className="text-[10px] uppercase tracking-wide text-muted">Prompt</p>
                                      <pre className="max-h-40 overflow-y-auto rounded-md bg-bg-elev/60 p-2 text-[11px] leading-snug whitespace-pre-wrap">
                                        {result.prompt}
                                      </pre>
                                    </div>
                                    <div>
                                      <p className="text-[10px] uppercase tracking-wide text-muted">Raw response</p>
                                      <pre className="max-h-40 overflow-y-auto rounded-md bg-bg-elev/60 p-2 text-[11px] leading-snug whitespace-pre-wrap">
                                        {result.raw}
                                      </pre>
                                    </div>
                                  </div>
                                </details>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {!adviceLoading.conventional &&
                      !adviceLoading.reasoning &&
                      !modelAdvice.conventional &&
                      !modelAdvice.reasoning && (
                        <p className="mt-4 text-sm text-muted">
                          Choose a model above to compare heuristics vs. reasoning using live Azure OpenAI calls.
                        </p>
                      )}
                  </CardContent>
                </Card>

                {/* Temporal Analysis */}
                <Card>
                  <CardHeader className="gap-4 md:flex md:items-start md:justify-between">
                    <div>
                      <CardTitle>Temporal Advantage Analysis</CardTitle>
                      <CardDescription>
                        Ask GPT-5-mini to critique both outputs and highlight the time-aware edge.
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!hasBothAdvice || analysisLoading}
                      onClick={() => void explainTemporalEdge()}
                    >
                      {analysisLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      Explain GPT-5&apos;s edge
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {analysisError && (
                      <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                        {analysisError}
                      </div>
                    )}
                    {!analysisLoading && !hasBothAdvice && (
                      <p className="text-sm text-muted">
                        Run both models first so GPT-5-mini can contrast them.
                      </p>
                    )}
                    {analysisLoading && (
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        GPT-5-mini is reviewing both strategies…
                      </div>
                    )}
                    {!analysisLoading && hasBothAdvice && !analysis && (
                      <p className="text-sm text-muted">
                        Click the button to generate a narrated breakdown of why the temporal model performs better.
                      </p>
                    )}
                    {analysis && !analysisLoading && (
                      <div className="space-y-4 text-sm text-muted">
                        <div>
                          <p className="text-base font-semibold text-text">{analysis.headline}</p>
                          <p className="mt-1 text-text">{analysis.verdict}</p>
                          <p className="mt-1 text-xs uppercase tracking-wide text-muted">
                            Confidence: {analysis.confidence}
                          </p>
                        </div>
                        {analysis.temporalFactors.length > 0 && (
                          <div>
                            <p className="text-[11px] uppercase tracking-wide text-muted">Temporal Factors</p>
                            <ul className="list-disc list-inside space-y-1">
                              {analysis.temporalFactors.map((factor, index) => (
                                <li key={`tf-${index}`}>{factor}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {analysis.conventionalGaps.length > 0 && (
                          <div>
                            <p className="text-[11px] uppercase tracking-wide text-muted">Conventional Gaps</p>
                            <ul className="list-disc list-inside space-y-1">
                              {analysis.conventionalGaps.map((gap, index) => (
                                <li key={`cg-${index}`}>{gap}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {analysis.reasoningEdge.length > 0 && (
                          <div>
                            <p className="text-[11px] uppercase tracking-wide text-muted">Reasoning Advantages</p>
                            <ul className="list-disc list-inside space-y-1">
                              {analysis.reasoningEdge.map((edge, index) => (
                                <li key={`re-${index}`}>{edge}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <details className="text-xs">
                          <summary className="cursor-pointer text-accent">View GPT-5 call</summary>
                          <div className="mt-2 space-y-2">
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-muted">Prompt</p>
                              <pre className="max-h-40 overflow-y-auto rounded-md bg-bg-elev/60 p-2 text-[11px] leading-snug whitespace-pre-wrap">
                                {analysis.prompt}
                              </pre>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-wide text-muted">Raw response</p>
                              <pre className="max-h-40 overflow-y-auto rounded-md bg-bg-elev/60 p-2 text-[11px] leading-snug whitespace-pre-wrap">
                                {analysis.raw}
                              </pre>
                            </div>
                          </div>
                        </details>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Advisory Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle>Strategy Advisory</CardTitle>
                    <CardDescription>
                      {activeStrategy === 'reasoning' ? 'Reasoning-based recommendations' : 'Conventional approach results'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {simulation.advice.map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="text-sm text-muted leading-relaxed flex items-start gap-2"
                        >
                          <span className="text-accent mt-0.5">•</span>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Footer Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={exportJSON}>
                    <Download className="w-4 h-4 mr-2" />
                    Export JSON
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setModelDiffOpen(true)}>
                    <FileJson className="w-4 h-4 mr-2" />
                    Model Diff
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
