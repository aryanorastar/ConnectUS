import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { PostForm } from '@/components/PostForm';
import PostCard from '@/components/PostCard';
import { TokenRewards } from '@/components/TokenRewards';
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
  User
} from 'lucide-react';

interface Post {
  id: number;
  author: string;
  displayName?: string;
  username?: string;
  content: string;
  timestamp: number;
  likes: number;
  rewards: number;
  mediaUrl: string;
}

type FeedFilter = 'newest' | 'trending' | 'following';

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [networkStats, setNetworkStats] = useState({
    totalPosts: 0,
    activeUsers: 0,
    cuDistributed: 0
  });
  const [currentFilter, setCurrentFilter] = useState<FeedFilter>('newest');
  const { toast } = useToast();
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, any[]>>({});
  const [commentInput, setCommentInput] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Mock user data for display names (in production, fetch from user profiles)
  const getUserDisplayInfo = (principalId: string) => {
    // Mock user mapping - in production, this would come from user profiles
    const userMap: Record<string, { displayName: string; username: string }> = {
      'team4_lead': { displayName: 'Team4 Lead', username: 'team4_lead' },
      'alice_dev': { displayName: 'Alice Developer', username: 'alice_dev' },
      'bob_designer': { displayName: 'Bob Designer', username: 'bob_designer' },
      'crypto_carol': { displayName: 'Carol Crypto', username: 'crypto_carol' },
      'tech_tom': { displayName: 'Tom Tech', username: 'tech_tom' },
      'art_anna': { displayName: 'Anna Artist', username: 'art_anna' }
    };

    // Check if it's a known user
    if (userMap[principalId]) {
      return userMap[principalId];
    }

    // For unknown users, create a friendly display name from the principal ID
    const shortId = principalId.length > 8 ? principalId.slice(0, 8) + '...' : principalId;
    return {
      displayName: `User ${shortId}`,
      username: principalId
    };
  };

  // Fetch posts from the canister
  const fetchPosts = async () => {
    setLoading(true);
    setStatsLoading(true);
    try {
      const canisterPosts = await team4Social.getPosts();
      // Map backend posts to frontend format
      const mapped = (canisterPosts as any[]).map((post: any) => {
        const principalId = post.author.toText ? post.author.toText() : String(post.author);
        const userInfo = getUserDisplayInfo(principalId);
        
        return {
          id: Number(post.id),
          author: principalId,
          displayName: userInfo.displayName,
          username: userInfo.username,
          content: post.content,
          timestamp: Number(post.timestamp),
          likes: Number(post.likes),
          rewards: Number(post.rewards),
          mediaUrl: post.mediaUrl,
        };
      });
      
      // Sort posts based on current filter
      let sortedPosts = mapped.reverse();
      switch (currentFilter) {
        case 'trending':
          sortedPosts = sortedPosts.sort((a, b) => (b.likes + b.rewards) - (a.likes + a.rewards));
          break;
        case 'newest':
          sortedPosts = sortedPosts.sort((a, b) => b.timestamp - a.timestamp);
          break;
        case 'following':
          // For now, just show newest posts (following functionality would require user authentication)
          sortedPosts = sortedPosts.sort((a, b) => b.timestamp - a.timestamp);
          break;
      }
      
      setPosts(sortedPosts);
      
      // Calculate network stats with a slight delay to show loading state
      setTimeout(() => {
        const uniqueUsers = new Set(sortedPosts.map(p => p.author));
        const totalRewards = sortedPosts.reduce((sum, post) => sum + post.rewards, 0);
        
        setNetworkStats({
          totalPosts: sortedPosts.length,
          activeUsers: uniqueUsers.size,
          cuDistributed: totalRewards
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
  }, [currentFilter]);

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

  // Stats skeleton component
  const StatsSkeleton = () => (
    <div className="space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Token Rewards */}
          <div className="lg:col-span-1 space-y-6">
            <TokenRewards />
            {/* Network Stats */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Network Stats
              </h3>
              {statsLoading ? (
                <StatsSkeleton />
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Posts</span>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{networkStats.totalPosts.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Users</span>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{networkStats.activeUsers.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">CU Distributed</span>
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">{networkStats.cuDistributed.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <PostForm onPost={handleNewPost} />
            
            {/* Feed Filters - Repositioned for better clarity */}
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Feed</h3>
                <Badge variant="outline" className="text-xs">
                  {posts.length} posts
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={currentFilter === 'newest' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentFilter('newest')}
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Newest
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
                  variant={currentFilter === 'following' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentFilter('following')}
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Following
                </Button>
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
                         'Posts from people you follow will appear here'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    author={post.displayName || post.author}
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