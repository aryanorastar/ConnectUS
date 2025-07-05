import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { PostForm } from '@/components/PostForm';
import PostCard from '@/components/PostCard';
import { TokenRewards } from '@/components/TokenRewards';
import { OnboardingGuide } from '@/components/OnboardingGuide';
import { team4Social } from '@/lib/icp';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  MessageCircle, 
  Share2, 
  Heart, 
  Gift,
  Plus,
  Activity,
  Zap,
  User,
  Star,
  Hash,
  BookOpen,
  Flame,
  Tag,
  ChevronDown
} from 'lucide-react';

interface Post {
  id: number;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
  rewards: number;
  mediaUrl: string;
}

type FeedFilter = 'foryou' | 'newest' | 'trending' | 'topics';

const SUGGESTED_POSTS: Post[] = [
  {
    id: 1001,
    author: 'explore_bot',
    content: 'Check out the trending #Web3 projects and join the conversation! 🚀',
    timestamp: Date.now() - 1000 * 60 * 60,
    likes: 42,
    rewards: 21,
    mediaUrl: ''
  },
  {
    id: 1002,
    author: 'community_leader',
    content: 'Our top contributor this week is @alice_dev! Congrats! #Community',
    timestamp: Date.now() - 1000 * 60 * 120,
    likes: 33,
    rewards: 18,
    mediaUrl: ''
  },
  {
    id: 1003,
    author: 'trending_now',
    content: 'Did you know? You can earn daily CU rewards for posting and engaging. #Rewards',
    timestamp: Date.now() - 1000 * 60 * 180,
    likes: 27,
    rewards: 15,
    mediaUrl: ''
  }
];

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [communityStats, setCommunityStats] = useState({
    postsToday: 0,
    activeThisWeek: 0,
    topContributor: 'alice_dev',
    topHashtag: '#Web3',
    streak: 5,
    cuEarnedToday: 0
  });
  const [currentFilter, setCurrentFilter] = useState<FeedFilter>('foryou');
  const { toast } = useToast();
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, any[]>>({});
  const [commentInput, setCommentInput] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [topicFilter, setTopicFilter] = useState<string>('all');

  // Fetch posts from the canister
  const fetchPosts = async () => {
    setLoading(true);
    setStatsLoading(true);
    try {
      const canisterPosts = await team4Social.getPosts();
      // Map backend posts to frontend format - keep it simple like Explore page
      const mapped = (canisterPosts as any[]).map((post: any) => ({
        id: Number(post.id),
        author: post.author.toText ? post.author.toText() : String(post.author),
        content: post.content,
        timestamp: Number(post.timestamp),
        likes: Number(post.likes),
        rewards: Number(post.rewards),
        mediaUrl: post.mediaUrl,
      }));
      // Sort posts based on current filter
      let sortedPosts = mapped;
      switch (currentFilter) {
        case 'trending':
          sortedPosts = sortedPosts.sort((a, b) => (b.likes + b.rewards) - (a.likes + a.rewards));
          break;
        case 'newest':
          sortedPosts = sortedPosts.sort((a, b) => b.timestamp - a.timestamp);
          break;
        case 'foryou':
          sortedPosts = sortedPosts.sort((a, b) => (b.likes + b.rewards * 2) - (a.likes + a.rewards * 2));
          break;
        case 'topics':
          sortedPosts = topicFilter === 'all' ? sortedPosts : sortedPosts.filter(p => p.content.toLowerCase().includes(topicFilter.toLowerCase()));
          break;
      }
      setPosts(sortedPosts);
      // Calculate community stats
      setTimeout(() => {
        const now = Date.now();
        const postsToday = sortedPosts.filter(p => now - p.timestamp < 1000 * 60 * 60 * 24).length;
        const activeThisWeek = new Set(sortedPosts.filter(p => now - p.timestamp < 1000 * 60 * 60 * 24 * 7).map(p => p.author)).size;
        const topContributor = sortedPosts.reduce((acc, p) => {
          acc[p.author] = (acc[p.author] || 0) + p.rewards;
          return acc;
        }, {} as Record<string, number>);
        const topUser = Object.entries(topContributor).sort((a, b) => b[1] - a[1])[0]?.[0] || 'alice_dev';
        const hashtags = sortedPosts.flatMap(p => (p.content.match(/#\w+/g) || []));
        const topHashtag = hashtags.sort((a, b) => hashtags.filter(h => h === b).length - hashtags.filter(h => h === a).length)[0] || '#Web3';
        const cuEarnedToday = sortedPosts.filter(p => now - p.timestamp < 1000 * 60 * 60 * 24).reduce((sum, p) => sum + p.rewards, 0);
        setCommunityStats({
          postsToday,
          activeThisWeek,
          topContributor: topUser,
          topHashtag,
          streak: 5,
          cuEarnedToday
        });
        setStatsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts from the blockchain.",
        variant: "destructive"
      });
      setStatsLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [currentFilter, topicFilter]);

  // Create a new post on-chain
  const handleNewPost = async (content: string, mediaUrl: string) => {
    try {
      await team4Social.createPost(content, mediaUrl);
      toast({
        title: "Success!",
        description: "Your post has been added to the blockchain.",
      });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Like a post on-chain
  const handleLike = async (postId: number) => {
    try {
      await team4Social.likePost(postId);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Share a post
  const handleShare = async (postId: number) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (post) {
        const shareText = `${post.content.slice(0, 100)}...\n\nShared from ConnectUS`;
        await navigator.share({
          title: 'ConnectUS Post',
          text: shareText,
          url: window.location.href
        });
      }
    } catch (error) {
      // Fallback for browsers that don't support Web Share API
      const post = posts.find(p => p.id === postId);
      if (post) {
        navigator.clipboard.writeText(`${post.content.slice(0, 100)}...\n\nShared from ConnectUS`);
        toast({
          title: "Shared!",
          description: "Post link copied to clipboard.",
        });
      }
    }
  };

  const handleOpenComments = async (postId: number) => {
    setOpenComments(openComments === postId ? null : postId);
    if (openComments !== postId) {
      setCommentLoading(true);
      try {
        const postComments = await team4Social.getComments(postId);
        setComments((prev) => ({ ...prev, [postId]: postComments as any[] }));
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast({
          title: "Error",
          description: "Failed to load comments.",
          variant: "destructive"
        });
      }
      setCommentLoading(false);
    }
  };

  const handleAddComment = async (postId: number) => {
    if (!commentInput.trim()) return;
    setCommentLoading(true);
    try {
      await team4Social.addComment(postId, commentInput);
      const postComments = await team4Social.getComments(postId);
      setComments((prev) => ({ ...prev, [postId]: postComments as any[] }));
      setCommentInput('');
      toast({ 
        title: 'Comment added!',
        description: "Your comment has been posted to the blockchain."
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive"
      });
    }
    setCommentLoading(false);
  };

  // Focus on post form when "Create Your First Post" is clicked
  const handleCreateFirstPost = () => {
    const postFormInput = document.querySelector('[data-post-form-input]') as HTMLTextAreaElement;
    if (postFormInput) {
      postFormInput.focus();
      postFormInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Loading skeleton component
  const PostSkeleton = () => (
    <div className="bg-card rounded-lg p-6 border border-border space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-4">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );

  // Community stats skeleton
  const StatsSkeleton = () => (
    <div className="space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );

  // Topic options
  const TOPICS = [
    'all', 'Web3', 'Crypto', 'DeFi', 'NFTs', 'Tech', 'Art', 'Gaming', 'Music', 'Education', 'Food', 'Travel', 'Photography', 'Design', 'Community'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <OnboardingGuide />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Token Rewards */}
          <div className="lg:col-span-1 space-y-6">
            <TokenRewards />
            {/* Community Stats */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Community Stats
              </h3>
              {statsLoading ? (
                <StatsSkeleton />
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Posts Today</span>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{communityStats.postsToday}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active This Week</span>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{communityStats.activeThisWeek}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Top Contributor</span>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">@{communityStats.topContributor}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Top Hashtag</span>
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">{communityStats.topHashtag}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Streak</span>
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="font-medium">{communityStats.streak} days</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">CU Earned Today</span>
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-pink-500" />
                      <span className="font-medium">{communityStats.cuEarnedToday}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <PostForm onPost={handleNewPost} />
            {/* Feed Filters - Enhanced */}
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Feed</h3>
                <Badge variant="outline" className="text-xs">
                  {posts.length} posts
                </Badge>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={currentFilter === 'foryou' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentFilter('foryou')}
                  className="flex items-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  For You
                </Button>
                <Button
                  variant={currentFilter === 'newest' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentFilter('newest')}
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Latest
                </Button>
                <Button
                  variant={currentFilter === 'trending' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentFilter('trending')}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </Button>
                <Button
                  variant={currentFilter === 'topics' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentFilter('topics')}
                  className="flex items-center gap-2"
                >
                  <Tag className="w-4 h-4" />
                  Topics
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
                {currentFilter === 'topics' && (
                  <select
                    className="ml-2 border rounded px-2 py-1 text-sm bg-background"
                    value={topicFilter}
                    onChange={e => setTopicFilter(e.target.value)}
                  >
                    {TOPICS.map(topic => (
                      <option key={topic} value={topic.toLowerCase()}>{topic}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className="space-y-6">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, index) => (
                  <PostSkeleton key={index} />
                ))
              ) : posts.length === 0 ? (
                // Enhanced empty state
                <div className="text-center py-16 bg-card rounded-lg border border-border">
                  <div className="max-w-md mx-auto">
                    <MessageCircle className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-3">No posts yet</h3>
                    <p className="text-muted-foreground mb-6 text-lg">
                      Be the first to share something on the blockchain!
                    </p>
                    <div className="space-y-4">
                      <Button 
                        onClick={handleCreateFirstPost}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold"
                        size="lg"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Your First Post
                      </Button>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Zap className="w-4 h-4" />
                        <span>Start earning CU tokens for your content</span>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                      <Badge variant="outline" className="text-sm">
                        {currentFilter === 'newest' ? 'Latest posts will appear here' :
                         currentFilter === 'trending' ? 'Popular posts will appear here' :
                         currentFilter === 'foryou' ? 'Personalized posts will appear here' :
                         'Posts from your selected topic will appear here'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : posts.length === 1 ? (
                <>
                  <PostCard
                    key={posts[0].id}
                    id={posts[0].id}
                    author={posts[0].author}
                    content={posts[0].content}
                    timestamp={posts[0].timestamp}
                    likes={posts[0].likes}
                    rewards={posts[0].rewards}
                    mediaUrl={posts[0].mediaUrl}
                    onLike={handleLike}
                    onShare={handleShare}
                    onOpenComments={handleOpenComments}
                    openComments={openComments}
                    comments={comments[posts[0].id] || []}
                    commentInput={commentInput}
                    setCommentInput={setCommentInput}
                    handleAddComment={handleAddComment}
                    commentLoading={commentLoading}
                  />
                  {/* Suggested content */}
                  <div className="mt-8">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-lg"><BookOpen className="w-5 h-5" /> You might like</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      {SUGGESTED_POSTS.map(post => (
                        <PostCard
                          key={post.id}
                          id={post.id}
                          author={post.author}
                          content={post.content}
                          timestamp={post.timestamp}
                          likes={post.likes}
                          rewards={post.rewards}
                          mediaUrl={post.mediaUrl}
                          onLike={handleLike}
                          onShare={handleShare}
                          onOpenComments={handleOpenComments}
                          openComments={openComments}
                          comments={comments[post.id] || []}
                          commentInput={commentInput}
                          setCommentInput={setCommentInput}
                          handleAddComment={handleAddComment}
                          commentLoading={commentLoading}
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    author={post.author}
                    content={post.content}
                    timestamp={post.timestamp}
                    likes={post.likes}
                    rewards={post.rewards}
                    mediaUrl={post.mediaUrl}
                    onLike={handleLike}
                    onShare={handleShare}
                    onOpenComments={handleOpenComments}
                    openComments={openComments}
                    comments={comments[post.id] || []}
                    commentInput={commentInput}
                    setCommentInput={setCommentInput}
                    handleAddComment={handleAddComment}
                    commentLoading={commentLoading}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;