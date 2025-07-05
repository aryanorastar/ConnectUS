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
import { Progress } from '@/components/ui/progress';
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
  ChevronDown,
  ChevronUp,
  Crown,
  TrendingUp as TrendingUpIcon,
  Lightbulb
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

// Enhanced suggested posts with better diversity
const SUGGESTED_POSTS: Post[] = [
  {
    id: 1001,
    author: 'tech_enthusiast',
    content: 'Just discovered an amazing new Web3 project! The potential for decentralized social networks is incredible. #Web3 #Innovation #FutureOfSocial',
    timestamp: Date.now() - 1000 * 60 * 30,
    likes: 42,
    rewards: 21,
    mediaUrl: ''
  },
  {
    id: 1002,
    author: 'art_creator',
    content: 'Working on my latest digital art piece inspired by blockchain technology. The intersection of creativity and technology is fascinating! 🎨 #DigitalArt #NFTs #Creativity',
    timestamp: Date.now() - 1000 * 60 * 45,
    likes: 33,
    rewards: 18,
    mediaUrl: ''
  },
  {
    id: 1003,
    author: 'crypto_learner',
    content: 'Learning about DeFi protocols today. The possibilities for financial innovation are endless! Anyone else exploring yield farming? #DeFi #Learning #CryptoEducation',
    timestamp: Date.now() - 1000 * 60 * 60,
    likes: 27,
    rewards: 15,
    mediaUrl: ''
  },
  {
    id: 1004,
    author: 'gaming_dev',
    content: 'Building a blockchain-based game! The concept of true ownership of in-game assets is revolutionary. #Gaming #Blockchain #GameDev #Innovation',
    timestamp: Date.now() - 1000 * 60 * 90,
    likes: 38,
    rewards: 22,
    mediaUrl: ''
  },
  {
    id: 1005,
    author: 'community_builder',
    content: 'The ConnectUS community is growing so fast! Love seeing everyone share their knowledge and support each other. #Community #ConnectUS #Growth',
    timestamp: Date.now() - 1000 * 60 * 120,
    likes: 45,
    rewards: 25,
    mediaUrl: ''
  },
  {
    id: 1006,
    author: 'music_producer',
    content: 'Exploring the future of music NFTs. Artists finally have true control over their work! #Music #NFTs #ArtistRights #Innovation',
    timestamp: Date.now() - 1000 * 60 * 150,
    likes: 31,
    rewards: 17,
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
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

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
      // Mark onboarding as completed when user creates first post
      if (!onboardingCompleted) {
        setOnboardingCompleted(true);
        setShowOnboarding(false);
      }
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
      await team4Social.sharePost(postId);
      toast({
        title: "Shared!",
        description: "Post shared successfully.",
      });
      fetchPosts();
    } catch (error) {
      console.error('Error sharing post:', error);
      toast({
        title: "Error",
        description: "Failed to share post. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Open comments for a post
  const handleOpenComments = async (postId: number) => {
    if (openComments === postId) {
      setOpenComments(null);
      return;
    }
    setOpenComments(postId);
    // Mock comments - in real app this would fetch from backend
    setComments(prev => ({
      ...prev,
      [postId]: [
        { id: 1, author: 'user1', content: 'Great post!', timestamp: Date.now() - 1000 * 60 * 5 },
        { id: 2, author: 'user2', content: 'Thanks for sharing!', timestamp: Date.now() - 1000 * 60 * 10 },
      ]
    }));
  };

  // Add a comment
  const handleAddComment = async (postId: number) => {
    if (!commentInput.trim()) return;
    setCommentLoading(true);
    try {
      // Mock comment addition - in real app this would call backend
      const newComment = {
        id: Date.now(),
        author: 'You',
        content: commentInput,
        timestamp: Date.now()
      };
      setComments(prev => ({
        ...prev,
        [postId]: [newComment, ...(prev[postId] || [])]
      }));
      setCommentInput('');
      toast({
        title: "Comment added!",
        description: "Your comment has been posted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive"
      });
    }
    setCommentLoading(false);
  };

  const handleCreateFirstPost = () => {
    // Scroll to post form
    document.getElementById('new-post')?.scrollIntoView({ behavior: 'smooth' });
  };

  const PostSkeleton = () => (
    <div className="bg-card rounded-lg border border-border p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
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

  // Enhanced empty state content for different filters
  const getEmptyStateContent = () => {
    switch (currentFilter) {
      case 'foryou':
        return {
          icon: Star,
          title: "Personalize Your Feed",
          description: "Your personalized feed will show content tailored to your interests. Start by creating posts and engaging with others!",
          action: "Create Your First Post",
          tips: ["Like posts to train your feed", "Follow topics you're interested in", "Engage with the community"]
        };
      case 'newest':
        return {
          icon: Clock,
          title: "No Recent Posts",
          description: "Be the first to share something new! Latest posts will appear here as they're created.",
          action: "Share Something New",
          tips: ["Posts are sorted by creation time", "Check back regularly for updates", "Create engaging content"]
        };
      case 'trending':
        return {
          icon: TrendingUp,
          title: "No Trending Content Yet",
          description: "Popular posts with high engagement will appear here. Start the trend!",
          action: "Create Trending Content",
          tips: ["Engage with others to boost visibility", "Use relevant hashtags", "Share valuable insights"]
        };
      case 'topics':
        return {
          icon: Tag,
          title: `No Posts in ${topicFilter === 'all' ? 'Any Topic' : topicFilter}`,
          description: `No posts found for this topic. Be the first to share about ${topicFilter === 'all' ? 'any topic' : topicFilter}!`,
          action: "Post About This Topic",
          tips: ["Use relevant hashtags", "Share your expertise", "Connect with like-minded users"]
        };
      default:
        return {
          icon: MessageCircle,
          title: "No posts yet",
          description: "Be the first to share something on the blockchain!",
          action: "Create Your First Post",
          tips: ["Start earning CU tokens", "Connect with the community", "Share your thoughts"]
        };
    }
  };

  const emptyState = getEmptyStateContent();

  return (
    <div className="min-h-screen bg-background">
      <Header showBreadcrumbs breadcrumbs={["Feed"]} />
      <div className="container mx-auto px-4 py-8">
        {/* Collapsible Onboarding Guide */}
        {showOnboarding && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Getting Started</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOnboarding(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronUp className="w-4 h-4 mr-1" />
                Collapse
              </Button>
            </div>
            <OnboardingGuide />
          </div>
        )}
        
        {/* Show onboarding toggle when collapsed */}
        {!showOnboarding && !onboardingCompleted && (
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowOnboarding(true)}
              className="w-full justify-center"
            >
              <ChevronDown className="w-4 h-4 mr-2" />
              Show Getting Started Guide
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Token Rewards */}
          <div className="lg:col-span-1 space-y-6">
            <TokenRewards />
            {/* Enhanced Community Stats with Visual Elements */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Community Stats
              </h3>
              {statsLoading ? (
                <StatsSkeleton />
              ) : (
                <div className="space-y-4">
                  {/* Posts Today with Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Posts Today</span>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{communityStats.postsToday}</span>
                      </div>
                    </div>
                    <Progress value={Math.min(communityStats.postsToday * 10, 100)} className="h-2" />
                  </div>

                  {/* Active Users with Visual Indicator */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Active This Week</span>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-500" />
                        <span className="font-medium">{communityStats.activeThisWeek}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(communityStats.activeThisWeek, 10) }).map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-green-500 rounded-full"></div>
                      ))}
                    </div>
                  </div>

                  {/* Top Contributor with Badge */}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Top Contributor</span>
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">@{communityStats.topContributor}</span>
                    </div>
                  </div>

                  {/* Top Hashtag with Trend */}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Top Hashtag</span>
                    <div className="flex items-center gap-2">
                      <TrendingUpIcon className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">{communityStats.topHashtag}</span>
                    </div>
                  </div>

                  {/* Streak with Visual */}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Streak</span>
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="font-medium">{communityStats.streak} days</span>
                    </div>
                  </div>

                  {/* CU Earned with Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">CU Earned Today</span>
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-pink-500" />
                        <span className="font-medium">{communityStats.cuEarnedToday}</span>
                      </div>
                    </div>
                    <Progress value={Math.min(communityStats.cuEarnedToday * 2, 100)} className="h-2" />
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
                // Enhanced empty state with contextual content
                <div className="text-center py-16 bg-card rounded-lg border border-border">
                  <div className="max-w-md mx-auto">
                    <emptyState.icon className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-3">{emptyState.title}</h3>
                    <p className="text-muted-foreground mb-6 text-lg">
                      {emptyState.description}
                    </p>
                    <div className="space-y-4">
                      <Button 
                        onClick={handleCreateFirstPost}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold"
                        size="lg"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        {emptyState.action}
                      </Button>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Zap className="w-4 h-4" />
                        <span>Start earning CU tokens for your content</span>
                      </div>
                    </div>
                    {/* Tips section */}
                    <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2 text-sm">💡 Tips:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {emptyState.tips.map((tip, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Lightbulb className="w-3 h-3 text-yellow-500" />
                            {tip}
                          </li>
                        ))}
                      </ul>
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
                  {/* Enhanced suggested content with better diversity */}
                  <div className="mt-8">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                      <BookOpen className="w-5 h-5" /> 
                      You might like
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      {SUGGESTED_POSTS.slice(0, 4).map(post => (
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
                    {/* Show more suggestions button */}
                    <div className="mt-4 text-center">
                      <Button variant="outline" size="sm">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Show More Suggestions
                      </Button>
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