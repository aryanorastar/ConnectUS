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
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';

export const TokenRewards = () => {
  const [claimed, setClaimed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Collapse by default on desktop
    setOpen(false);
  }, []);

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

  // Collapsed summary bar
  const summaryBar = (
    <div className="flex items-center justify-between px-4 py-2 bg-muted/40 rounded-lg border border-border cursor-pointer hover:bg-muted/60 transition-all" onClick={() => setOpen(o => !o)}>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gradient-accent rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-accent-foreground">CU</span>
        </div>
        <span className="font-medium">Token Rewards</span>
        <Badge className="ml-2 bg-gradient-accent text-accent-foreground">1,247 CU</Badge>
        <Badge className="ml-2 bg-green-100 text-green-700">45d</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" className="px-2 py-1 h-7 text-xs" disabled={claimed} onClick={e => {e.stopPropagation(); handleClaimRewards();}}>
          {claimed ? <CheckCircle className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
          <span className="ml-1">{claimed ? 'Claimed' : 'Claim'}</span>
        </Button>
        {open ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          {summaryBar}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="w-full mt-2 border border-border bg-card/80 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-base">
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
            <CardContent className="space-y-3 pt-0">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="text-center p-2 bg-muted/20 rounded-lg">
                  <div className="text-lg font-bold text-primary">1,247</div>
                  <div className="text-xs text-muted-foreground">Total CU Earned</div>
                </div>
                <div className="text-center p-2 bg-muted/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600">45</div>
                  <div className="text-xs text-muted-foreground">Days Active</div>
                </div>
              </div>

              {rewards.map((reward, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-between p-2 rounded-lg border border-border hover:bg-muted/40 transition-colors cursor-help">
                      <div>
                        <p className="font-medium text-foreground text-sm">{reward.action}</p>
                        <p className="text-xs text-muted-foreground">{reward.description}</p>
                      </div>
                      <Badge className="bg-gradient-accent text-accent-foreground text-xs">
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
                className={`w-full mt-2 transition-all duration-300 text-sm ${
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
              <div className="mt-3 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">Weekly Progress</span>
                  <Badge variant="outline" className="text-xs">3/4 Complete</Badge>
                </div>
                <div className="space-y-1">
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
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
  );
};