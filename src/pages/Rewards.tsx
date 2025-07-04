import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { team4Social } from '@/lib/icp';

const Rewards = () => {
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const user = await team4Social.getMyProfile();
        setProfile(user);
        const allPosts = await team4Social.getPosts();
        setPosts(allPosts.filter((post: any) => {
          const author = post.author?.toText ? post.author.toText() : post.author;
          const principal = user?.principal?.toText ? user.principal.toText() : user?.principal;
          return author === principal;
        }));
        // Fetch leaderboard
        const lb = await team4Social.getLeaderboard(5);
        setLeaderboard(lb);
      } catch (e) {}
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalEarned = profile?.totalRewards || 0;
  const postsCount = profile?.postsCount || 0;
  const likesReceived = posts.reduce((sum, post) => sum + Number(post.likes), 0);
  const level = totalEarned > 1000 ? 'Gold Contributor' : totalEarned > 500 ? 'Silver Contributor' : 'Bronze Contributor';
  const thisWeek = 0; // Placeholder, implement logic if you track weekly rewards
  const weeklyProgress = 0; // Placeholder, implement logic if you track weekly progress

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-10 text-center">Leaderboard</h1>
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white/70 rounded-2xl shadow-lg border border-indigo-100">
              <div className="mb-6">
                <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto text-yellow-400">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21h8M12 17v4m8-16v2a4 4 0 01-4 4H8a4 4 0 01-4-4V5m16 0a2 2 0 00-2-2H6a2 2 0 00-2 2m16 0v2a4 4 0 01-4 4H8a4 4 0 01-4-4V5" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-yellow-600 mb-2">No Leaderboard Data Yet</h2>
              <p className="text-lg text-muted-foreground mb-6">Participate, create posts, and earn rewards to see your name here!</p>
              <div>
                <span className="inline-block bg-gradient-to-tr from-yellow-400 to-pink-400 text-white font-bold px-6 py-3 rounded-xl shadow hover:from-yellow-500 hover:to-pink-500 transition-all cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Start Earning Rewards
                </span>
              </div>
            </div>
          ) : (
            leaderboard.map((user, i) => (
              <div key={i} className="rounded-2xl bg-white/80 shadow-lg p-6 flex items-center gap-4 border border-indigo-100 hover:shadow-2xl transition-all">
                <span className="text-2xl font-bold text-indigo-600">#{i + 1}</span>
                <span className="ml-2 font-semibold text-indigo-700">{user.username}</span>
                <span className="ml-auto text-lg text-purple-700 font-bold">{user.totalRewards} T4T</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Rewards;