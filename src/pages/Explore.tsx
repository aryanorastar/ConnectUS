import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { PostCard } from '@/components/PostCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { team4Social } from '@/lib/icp';

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [trendingTopics, setTrendingTopics] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const posts = await team4Social.getPosts();
        // Sort by likes to get trending
        const sorted = posts
          .map((post: any) => ({
            id: Number(post.id),
            author: post.author?.toText ? post.author.toText() : post.author,
            content: post.content,
            timestamp: Number(post.timestamp),
            likes: Number(post.likes),
            rewards: Number(post.rewards),
          }))
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 10);
        setTrendingPosts(sorted);
        // Fetch trending hashtags
        const tags = await team4Social.getTrendingHashtags(10);
        setTrendingTopics(tags);
      } catch (e) {}
      setLoading(false);
    };
    fetchTrending();
  }, []);

  const handleLike = async (postId: number) => {
    try {
      await team4Social.likePost(postId);
      // Refresh trending posts
      const posts = await team4Social.getPosts();
      const sorted = posts
        .map((post: any) => ({
          id: Number(post.id),
          author: post.author?.toText ? post.author.toText() : post.author,
          content: post.content,
          timestamp: Number(post.timestamp),
          likes: Number(post.likes),
          rewards: Number(post.rewards),
        }))
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 10);
      setTrendingPosts(sorted);
    } catch (e) {}
  };

  // Trending topics and top users remain mock for now
  const topUsers = [
    { name: 'Arnav Jhalani', followers: 2847, t4tEarned: 15600 },
    { name: 'Aryan Gupta', followers: 2134, t4tEarned: 12800 },
    { name: 'CryptoVisionary', followers: 1856, t4tEarned: 11200 },
    { name: 'BlockchainGuru', followers: 1567, t4tEarned: 9800 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-purple-50 to-pink-50">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-10 text-center">Trending Hashtags</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-2 flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
            </div>
          ) : trendingTopics.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-24 text-center bg-white/70 rounded-2xl shadow-lg border border-indigo-100">
              <div className="mb-6">
                <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto text-purple-400">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h10M7 11h10M9 15h6M5 3v18M19 3v18" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-purple-700 mb-2">No Trending Hashtags Yet</h2>
              <p className="text-lg text-muted-foreground mb-6">Start a trend! Use hashtags in your posts to see them appear here.</p>
              <div>
                <span className="inline-block bg-gradient-to-tr from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-xl shadow hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Create a Post with #Hashtag
                </span>
              </div>
            </div>
          ) : (
            trendingTopics.map(([tag, count], i) => (
              <div key={i} className="rounded-2xl bg-white/80 shadow-lg p-6 flex items-center gap-4 border border-indigo-100 hover:shadow-2xl transition-all">
                <span className="text-2xl font-bold text-indigo-600">{tag}</span>
                <span className="ml-auto text-lg text-muted-foreground">{count} posts</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;