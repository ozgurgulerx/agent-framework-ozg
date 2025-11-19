import { Header } from '../components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Sparkles } from 'lucide-react';

export function AdvancedRecommenders() {
  return (
    <>
      <Header
        title="Advanced Recommender Systems"
        description="Temporal-threshold card/offer selection with explainability and trade-off analysis"
        breadcrumbs={['Demos', 'Advanced Recommenders']}
      />
      <div className="flex-1 p-8">
        <div className="max-w-4xl">
          <Card className="bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <CardTitle>Coming Soon</CardTitle>
                    <Badge>Recommendation</Badge>
                  </div>
                  <CardDescription className="mt-2">
                    This demo is under development
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted leading-relaxed">
                This demo will illustrate intelligent recommendation systems with:
              </p>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Temporal threshold awareness (when to apply for cards)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Multi-criteria offer selection (rewards, APR, fees, credit impact)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Explainability panel showing why each recommendation was made</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Trade-off visualization and alternative comparison</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
