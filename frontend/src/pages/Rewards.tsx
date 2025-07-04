import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const Rewards = () => {
  const rewardStats = {
    totalEarned: 1250,
    thisWeek: 85,
    thisMonth: 340,
    nextMilestone: 1500,
    progress: 83
  };

  const recentRewards = [
    { type: 'Post Like', amount: 1, timestamp: '2 hours ago', from: 'CryptoEnthusiast' },
    { type: 'Quality Post', amount: 5, timestamp: '4 hours ago', from: 'System' },
    { type: 'Comment Like', amount: 1, timestamp: '6 hours ago', from: 'BlockchainDev' },
    { type: 'Daily Bonus', amount: 10, timestamp: '1 day ago', from: 'System' },
    { type: 'Post Share', amount: 2, timestamp: '1 day ago', from: 'DeFiExplorer' }
  ];

  const milestones = [
    { threshold: 100, reward: 'First Steps Badge', claimed: true },
    { threshold: 500, reward: 'Active Member Badge', claimed: true },
    { threshold: 1000, reward: 'Community Leader Badge', claimed: true },
    { threshold: 1500, reward: 'Crypto Pioneer Badge + 50 T4T', claimed: false },
    { threshold: 2500, reward: 'Platform Ambassador Badge + 100 T4T', claimed: false }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Rewards</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-sm">Total Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{rewardStats.totalEarned}</div>
                <p className="text-sm text-muted-foreground">T4T Tokens</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-sm">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{rewardStats.thisWeek}</div>
                <p className="text-sm text-muted-foreground">T4T Tokens</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-sm">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{rewardStats.thisMonth}</div>
                <p className="text-sm text-muted-foreground">T4T Tokens</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-sm">Next Milestone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{rewardStats.nextMilestone}</div>
                <p className="text-sm text-muted-foreground">T4T Target</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Progress to Next Milestone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Current: {rewardStats.totalEarned} T4T</span>
                <span>Target: {rewardStats.nextMilestone} T4T</span>
              </div>
              <Progress value={rewardStats.progress} className="h-3" />
              <p className="text-sm text-muted-foreground">
                You need {rewardStats.nextMilestone - rewardStats.totalEarned} more T4T tokens to reach the next milestone!
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRewards.map((reward, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                    <div>
                      <div className="font-medium">{reward.type}</div>
                      <div className="text-sm text-muted-foreground">
                        From: {reward.from} • {reward.timestamp}
                      </div>
                    </div>
                    <Badge className="text-sm">+{reward.amount} T4T</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                    <div>
                      <div className="font-medium">{milestone.threshold} T4T</div>
                      <div className="text-sm text-muted-foreground">{milestone.reward}</div>
                    </div>
                    {milestone.claimed ? (
                      <Badge variant="secondary">Claimed</Badge>
                    ) : (
                      <Button size="sm" disabled={rewardStats.totalEarned < milestone.threshold}>
                        {rewardStats.totalEarned >= milestone.threshold ? 'Claim' : 'Locked'}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Rewards;