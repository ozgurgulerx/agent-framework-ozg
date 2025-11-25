import { Header } from '../components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { HelpingHand } from 'lucide-react';

export function SocialNegotiation() {
  return (
    <>
      <Header
        title="Social Negotiation"
        description="Payment plan renegotiation with BNPL providers and card issuers for better terms"
        breadcrumbs={['Demos', 'Social Negotiation']}
      />
      <div className="flex-1 p-8">
        <div className="max-w-4xl">
          <Card className="bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center">
                  <HelpingHand className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <CardTitle>Coming Soon</CardTitle>
                    <Badge>Negotiation</Badge>
                  </div>
                  <CardDescription className="mt-2">
                    This demo is under development
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted leading-relaxed">
                This demo will showcase AI-assisted negotiation capabilities:
              </p>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>BNPL payment plan renegotiation scenarios</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Credit card issuer dialogue simulations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Outcome comparison (APR reduction, grace periods, fee waivers)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Multi-turn conversation visualization</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
