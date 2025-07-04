import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WalletConnectionProps {
  onConnect: () => void;
}

export const LandingPage = ({ onConnect }: WalletConnectionProps) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      onConnect();
    }, 2000);
  };

  const features = [
    {
      title: "Decentralized Posts",
      description: "Your content lives permanently on the Internet Computer blockchain",
      icon: "🔗"
    },
    {
      title: "Token Rewards", 
      description: "Earn T4T tokens for quality content and community engagement",
      icon: "💰"
    },
    {
      title: "Censorship Resistant",
      description: "No central authority can delete or modify your posts",
      icon: "🛡️"
    },
    {
      title: "True Ownership",
      description: "You own your data, your identity, and your digital assets",
      icon: "👑"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">T4</span>
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold text-foreground">Team4 Social</h1>
              <p className="text-lg text-muted-foreground">Decentralized • On-Chain • Rewarded</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-foreground leading-tight">
            The Future of Social Media is
            <span className="text-primary"> Decentralized</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Built on Internet Computer Protocol, where your content is permanent, 
            your data is yours, and quality contributions are rewarded with tokens.
          </p>

          <Card className="max-w-lg mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Connect Your Wallet</CardTitle>
              <p className="text-muted-foreground">
                Access the decentralized social network
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button 
                onClick={handleConnect}
                disabled={isConnecting}
                size="lg"
                className="w-full text-lg h-12 font-semibold"
              >
                {isConnecting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    <span>Connecting to ICP...</span>
                  </div>
                ) : (
                  <>
                    <span className="mr-2">🔐</span>
                    Connect Internet Identity
                  </>
                )}
              </Button>
              
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">Secure</Badge>
                <Badge variant="outline" className="text-xs">Decentralized</Badge>
                <Badge variant="outline" className="text-xs">Anonymous</Badge>
              </div>
            </CardContent>
          </Card>

          <p className="text-muted-foreground">
            No email required • No KYC • No central server
          </p>
        </div>

        <div className="py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Choose Decentralized?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience social media the way it was meant to be - free, open, and rewarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="text-lg font-bold mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="py-16 text-center">
          <h3 className="text-3xl font-bold mb-8">Built by Team4</h3>
          <div className="flex justify-center space-x-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-xl font-bold">AJ</span>
              </div>
              <h4 className="font-bold text-lg mb-1">Arnav Jhalani</h4>
              <p className="text-muted-foreground">Blockchain Developer</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-xl font-bold">AG</span>
              </div>
              <h4 className="font-bold text-lg mb-1">Aryan Gupta</h4>
              <p className="text-muted-foreground">Smart Contract Engineer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};