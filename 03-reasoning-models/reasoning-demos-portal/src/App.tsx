import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { ModelDiffDrawer } from './components/demos/ModelDiffDrawer';
import { Landing } from './pages/Landing';
import { TemporalSavingsCoach } from './pages/TemporalSavingsCoach';
import { MultiConstraintPlanner } from './pages/MultiConstraintPlanner';
import { WhatIfSimulations } from './pages/WhatIfSimulations';
import { EmpatheticCommunication } from './pages/EmpatheticCommunication';
import { SocialNegotiation } from './pages/SocialNegotiation';
import { AdvancedRecommenders } from './pages/AdvancedRecommenders';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/temporal-savings-coach" element={<TemporalSavingsCoach />} />
            <Route path="/multi-constraint-planner" element={<MultiConstraintPlanner />} />
            <Route path="/what-if-simulations" element={<WhatIfSimulations />} />
            <Route path="/empathetic-communication" element={<EmpatheticCommunication />} />
            <Route path="/social-negotiation" element={<SocialNegotiation />} />
            <Route path="/advanced-recommenders" element={<AdvancedRecommenders />} />
          </Routes>
          <ModelDiffDrawer />
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
