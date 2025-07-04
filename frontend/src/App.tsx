import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/Header';
import { LandingPage } from '@/components/LandingPage';
import Index from '@/pages/Index';
import Feed from '@/pages/Feed';
import Explore from '@/pages/Explore';
import Rewards from '@/pages/Rewards';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';

function App() {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  };

  if (!isConnected) {
    return (
      <>
        <LandingPage onConnect={handleConnect} />
        <Toaster />
      </>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;