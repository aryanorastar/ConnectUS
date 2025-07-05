import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  Clock, 
  Gift, 
  HelpCircle, 
  TrendingUp,
  Users,
  Award,
  Zap
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const TokenRewards = () => {
  const [claimed, setClaimed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  const rewards = [
    { 
      action: 'Daily Login', 
      amount: 10, 
      description: 'Connect to the network',
      tooltip: 'Earn CU tokens simply by logging into ConnectUS daily. This encourages regular engagement with the platform.'
    },
    { 
      action: 'Create Post', 
      amount: 25, 
      description: 'Share quality content',
      tooltip: 'Get rewarded for creating valuable content that engages the community. Quality posts earn more tokens.'
    },
    { 
      action: 'Receive Like', 
      amount: 5, 
      description: 'Engage the community',
      tooltip: 'Earn tokens when others like your content. This incentivizes creating content that resonates with the community.'
    },
    { 
      action: 'Weekly Bonus', 
      amount: 100, 
      description: 'Active participation',
      tooltip: 'Complete weekly challenges: post 3+ times, receive 10+ likes, and engage with 5+ other posts. Rewards active community members.'
    },
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
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-accent-foreground">CU</span>
            </div>
            <span>CU Token Rewards</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p><strong>CU Tokens</strong> are ConnectUS rewards earned for platform engagement. Use them for premium features, governance voting, and community recognition.</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">1,247</div>
              <div className="text-xs text-muted-foreground">Total CU Earned</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-green-600">45</div>
              <div className="text-xs text-muted-foreground">Days Active</div>
            </div>
          </div>

          {rewards.map((reward, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-help">
                  <div>
                    <p className="font-medium text-foreground">{reward.action}</p>
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                  </div>
                  <Badge className="bg-gradient-accent text-accent-foreground">
                    +{reward.amount} CU
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{reward.tooltip}</p>
              </TooltipContent>
            </Tooltip>
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

          {/* Weekly Progress */}
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Weekly Progress</span>
              <Badge variant="outline" className="text-xs">3/4 Complete</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Posts Created</span>
                <span className="font-medium">5/3 ✓</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Likes Received</span>
                <span className="font-medium">15/10 ✓</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Community Engagement</span>
                <span className="font-medium">3/5</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};