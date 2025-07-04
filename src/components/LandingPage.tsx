import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

import heroBackground from '@/assets/hero-bg.jpg';

interface WalletConnectionProps {
  onConnect: () => void;
}

export const LandingPage = ({ onConnect }: WalletConnectionProps) => {
  const { login, isAuthenticated } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await login();
      // The parent component will handle the navigation after successful login
      onConnect();
    } catch (error) {
      console.error('Login error:', error);
      // You could add error state handling here to show an error message to the user
    } finally {
      setIsConnecting(false);
    }
  };

  const features = [
    {
      title: "Decentralized Network",
      description: "Your content lives permanently on the Internet Computer blockchain",
      icon: "🌐"
    },
    {
      title: "Earn Rewards", 
      description: "Earn CU tokens for quality content and community engagement",
      icon: "💎"
    },
    {
      title: "Own Your Data",
      description: "Complete control over your digital identity and content",
      icon: "🔒"
    },
    {
      title: "No Censorship",
      description: "Express yourself freely without central control",
      icon: "🗽"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-200 via-purple-100 to-pink-100 flex items-center justify-center">
      {/* Hero Section */}
      <div 
        className="relative min-h-screen w-full flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400/60 via-purple-300/40 to-pink-200/40 backdrop-blur-md"></div>
        <div className="relative text-center space-y-10 px-4 max-w-4xl mx-auto z-10 py-24">
          {/* ConnectUS Logo */}
          <div className="flex items-center justify-center space-x-6 mb-12">
            <div className="w-28 h-28 bg-gradient-to-tr from-indigo-500 to-purple-400 rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-5xl drop-shadow">CU</span>
            </div>
            <div className="text-left">
              <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-indigo-700 to-purple-500">ConnectUS</h1>
              <p className="text-2xl text-muted-foreground font-medium mt-2">Decentralized • Secure • Yours</p>
            </div>
          </div>
          <h2 className="text-5xl font-bold text-foreground leading-tight">
            The Future of Social Media is
            <span className="text-primary"> Decentralized</span>
          </h2>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Built on Internet Computer Protocol, where your content is permanent, 
            your data is yours, and quality contributions are rewarded.
          </p>
          {/* Connection Card */}
          <Card className="max-w-lg mx-auto border-none bg-white/70 backdrop-blur-lg shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2 font-bold">Get Started</CardTitle>
              <p className="text-muted-foreground text-lg">
                Join the decentralized social network
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Button 
                  className="w-full h-14 text-xl bg-gradient-to-tr from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold shadow-lg rounded-xl"
                  onClick={handleConnect}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect with Internet Identity'
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  You'll be redirected to authenticate with Internet Identity
                </p>
                <p className="text-sm text-muted-foreground">
                  No account? Create one in seconds
                </p>
              </div>
            </CardContent>
          </Card>
          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center space-x-4 p-6 bg-white/60 rounded-2xl shadow-md backdrop-blur-md">
                <span className="text-3xl">{feature.icon}</span>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-indigo-700">{feature.title}</h3>
                  <p className="text-base text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};