import { Header } from '../components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { HeartHandshake } from 'lucide-react';

export function EmpatheticCommunication() {
  return (
    <>
      <Header
        title="Empathetic Communication"
        description="Tone-aware responses that preserve user values while delivering financial guidance"
        breadcrumbs={['Demos', 'Empathetic Communication']}
      />
      <div className="flex-1 p-8">
        <div className="max-w-4xl">
          <Card className="bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center">
                  <HeartHandshake className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <CardTitle>Coming Soon</CardTitle>
                    <Badge>Communication</Badge>
                  </div>
                  <CardDescription className="mt-2">
                    This demo is under development
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted leading-relaxed">
                This demo will demonstrate how reasoning models adapt communication style
                based on context and user values:
              </p>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Tone sliders (empathetic, neutral, direct)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Side-by-side comparison of cold vs empathetic responses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Preservation of stated user values (gym membership, social dining)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Context-aware guidance that respects personal priorities</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
