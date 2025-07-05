import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clock, Gift } from 'lucide-react';

export const TokenRewards = () => {
  const [claimed, setClaimed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  const rewards = [
    { action: 'Daily Login', amount: 10, description: 'Connect to the network' },
    { action: 'Create Post', amount: 25, description: 'Share quality content' },
    { action: 'Receive Like', amount: 5, description: 'Engage the community' },
    { action: 'Weekly Bonus', amount: 100, description: 'Active participation' },
  ];

  // Handle countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (claimed && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setClaimed(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [claimed, countdown]);

  const handleClaimRewards = () => {
    setClaimed(true);
    setCountdown(24 * 60 * 60); // 24 hours in seconds
    toast({
      title: "Rewards Claimed!",
      description: "You've earned 10 CU tokens for daily login.",
    });
  };

  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-accent-foreground">T4</span>
          </div>
          <span>Token Rewards</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {rewards.map((reward, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <div>
              <p className="font-medium text-foreground">{reward.action}</p>
              <p className="text-sm text-muted-foreground">{reward.description}</p>
            </div>
            <Badge className="bg-gradient-accent text-accent-foreground">
              +{reward.amount} T4T
            </Badge>
          </div>
        ))}
        
        <Button 
          className={`w-full mt-4 transition-all duration-300 ${
            claimed 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'bg-gradient-secondary hover:bg-gradient-primary'
          }`}
          onClick={handleClaimRewards}
          disabled={claimed}
        >
          {claimed ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Claimed</span>
              <span className="text-xs opacity-75">
                ({formatCountdown(countdown)})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              <span>Claim Daily Rewards</span>
            </div>
          )}
        </Button>
        
        {claimed && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <Clock className="w-3 h-3" />
            <span>Next claim available in {formatCountdown(countdown)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};