import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const platformStats = {
    totalPosts: 1847,
    activeUsers: 523,
    tokensDistributed: 45230,
    transactions: 12450
  };

  const recentActivity = [
    { type: 'New Post', user: 'CryptoEnthusiast', content: 'Just deployed my first smart contract...', time: '2m ago' },
    { type: 'Like', user: 'BlockchainDev', content: 'Liked a post about ICP development', time: '5m ago' },
    { type: 'Reward', user: 'DeFiExplorer', content: 'Earned 5 T4T for quality content', time: '8m ago' },
    { type: 'New User', user: 'Web3Newbie', content: 'Joined Team4 Social', time: '12m ago' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to Team4 Social</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The decentralized social network where your content is permanent, 
            your data is yours, and your contributions are rewarded.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-sm">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{platformStats.totalPosts}</div>
                <p className="text-sm text-muted-foreground">On-Chain</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-sm">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{platformStats.activeUsers}</div>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-sm">T4T Distributed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{platformStats.tokensDistributed}</div>
                <p className="text-sm text-muted-foreground">Total Rewards</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-sm">Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{platformStats.transactions}</div>
                <p className="text-sm text-muted-foreground">On ICP</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/feed">
                <Button className="w-full justify-start">
                  📝 Create Your First Post
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="outline" className="w-full justify-start">
                  🔍 Explore Content
                </Button>
              </Link>
              <Link to="/rewards">
                <Button variant="outline" className="w-full justify-start">
                  💰 Check Your Rewards
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="w-full justify-start">
                  👤 View Your Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 border-b pb-3 last:border-b-0">
                    <Badge variant="outline" className="text-xs mt-1">{activity.type}</Badge>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{activity.user}</div>
                      <div className="text-sm text-muted-foreground">{activity.content}</div>
                      <div className="text-xs text-muted-foreground mt-1">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About Team4 Social</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl mb-2">🔗</div>
                <h4 className="font-semibold mb-2">Decentralized</h4>
                <p className="text-sm text-muted-foreground">
                  Built on Internet Computer Protocol for true decentralization and censorship resistance.
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💰</div>
                <h4 className="font-semibold mb-2">Rewarded</h4>
                <p className="text-sm text-muted-foreground">
                  Earn T4T tokens for creating quality content and engaging with the community.
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🛡️</div>
                <h4 className="font-semibold mb-2">Secure</h4>
                <p className="text-sm text-muted-foreground">
                  Your data is yours. No central authority can access or modify your content.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;