import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CalendarClock,
  Network,
  GitBranch,
  HeartHandshake,
  HelpingHand,
  Sparkles
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { demos } from '../data/mockData';

const iconMap: Record<string, LucideIcon> = {
  'calendar-clock': CalendarClock,
  'network': Network,
  'git-branch': GitBranch,
  'heart-handshake': HeartHandshake,
  'helping-hand': HelpingHand,
  'sparkles': Sparkles
};

export function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <Header
        title="Reasoning Models Demo Portal"
        description="Explore how advanced reasoning models handle complex real-world scenarios through interactive demonstrations."
      />
      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
          {demos.map((demo, index) => {
            const Icon = iconMap[demo.icon];
            return (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="h-full flex flex-col cursor-pointer group hover:border-accent/50 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <Badge>{demo.badge}</Badge>
                    </div>
                    <CardTitle className="text-xl">{demo.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {demo.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(demo.route)}
                    >
                      Open Demo
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 max-w-7xl">
          <Card className="bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
            <CardHeader>
              <CardTitle className="text-xl">About This Portal</CardTitle>
              <CardDescription className="mt-2 text-base leading-relaxed">
                This interactive portal demonstrates the capabilities of advanced reasoning models
                across six key domains. Each demo compares conventional approaches with reasoning-enhanced
                strategies, highlighting the impact of temporal awareness, multi-constraint planning,
                empathetic communication, and strategic optimization.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-text mb-1">Interactive Demos</h4>
                  <p className="text-xs text-muted">
                    Explore each scenario with real data and see the reasoning process in action.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text mb-1">Model Comparisons</h4>
                  <p className="text-xs text-muted">
                    Compare conventional vs reasoning approaches to understand the key differences.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text mb-1">Visual Analytics</h4>
                  <p className="text-xs text-muted">
                    Charts, timelines, and KPIs make complex reasoning patterns easy to understand.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
