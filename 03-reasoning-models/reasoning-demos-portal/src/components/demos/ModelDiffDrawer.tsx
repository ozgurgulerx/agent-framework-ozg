import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { modelDiffPoints } from '../../data/mockData';

const impactIcons = {
  critical: AlertTriangle,
  high: AlertCircle,
  medium: Info
};

const impactVariants = {
  critical: 'error',
  high: 'warning',
  medium: 'default'
} as const;

export function ModelDiffDrawer() {
  const { modelDiffOpen, setModelDiffOpen } = useAppStore();

  return (
    <AnimatePresence>
      {modelDiffOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setModelDiffOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-bg-elev border-l border-gray-800 z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-bg-elev border-b border-gray-800 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text">Model Comparison</h2>
                <p className="text-sm text-muted mt-1">
                  Conventional vs Reasoning: Key Differences
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setModelDiffOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-accent mb-2">
                  Why Reasoning Models Excel
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Reasoning models understand temporal constraints, maintain context across
                  complex planning scenarios, and adapt strategies based on multiple conflicting
                  requirements - going beyond simple pattern matching.
                </p>
              </div>

              <div className="space-y-4">
                {modelDiffPoints.map((point, index) => {
                  const Icon = impactIcons[point.impact];
                  return (
                    <motion.div
                      key={point.category}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-card border border-gray-800 rounded-lg p-5"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="mt-0.5">
                          <Icon className={`w-5 h-5 ${
                            point.impact === 'critical' ? 'text-red-400' :
                            point.impact === 'high' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-text">{point.category}</h4>
                            <Badge variant={impactVariants[point.impact]}>
                              {point.impact}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 ml-8">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                              Conventional
                            </span>
                          </div>
                          <p className="text-sm text-muted leading-relaxed pl-4">
                            {point.conventional}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                              Reasoning
                            </span>
                          </div>
                          <p className="text-sm text-text leading-relaxed pl-4">
                            {point.reasoning}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-green-400 mb-2">
                  Bottom Line
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Reasoning models prevent critical failures (overdrafts, missed payments) by
                  understanding timing constraints, maintaining awareness of multiple concurrent
                  obligations, and optimizing decisions across temporal boundaries.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
