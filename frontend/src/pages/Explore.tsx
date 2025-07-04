import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const trendingTopics = [
    { tag: '#ICP', posts: 1250 },
    { tag: '#Web3', posts: 890 },
    { tag: '#DeFi', posts: 650 },
    { tag: '#NFTs', posts: 420 },
    { tag: '#Team4', posts: 380 }
  ];

  const suggestedUsers = [
    { username: 'CryptoExpert', followers: 2500, verified: true },
    { username: 'ICPDeveloper', followers: 1800, verified: true },
    { username: 'BlockchainNews', followers: 3200, verified: false },
    { username: 'DeFiAnalyst', followers: 950, verified: true }
  ];

  const popularPosts = [
    {
      id: '1',
      author: 'ICPFoundation',
      content: 'Major update coming to the Internet Computer Protocol! Enhanced scalability and new features.',
      likes: 156,
      rewards: 45
    },
    {
      id: '2',
      author: 'Web3Pioneer',
      content: 'The decentralized future is closer than we think. Projects like Team4 Social are leading the way.',
      likes: 89,
      rewards: 23
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Explore</h1>
        
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search posts, users, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularPosts.map((post) => (
                    <div key={post.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{post.author}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{post.likes} likes</Badge>
                          <Badge>{post.rewards} T4T</Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{post.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium text-primary">{topic.tag}</span>
                      <span className="text-sm text-muted-foreground">{topic.posts} posts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suggested Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestedUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{user.username}</span>
                          {user.verified && <Badge variant="secondary" className="text-xs">✓</Badge>}
                        </div>
                        <span className="text-sm text-muted-foreground">{user.followers} followers</span>
                      </div>
                      <Button size="sm" variant="outline">Follow</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;