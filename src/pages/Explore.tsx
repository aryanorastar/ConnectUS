import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { team4Social } from '@/lib/icp';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  TrendingUp, 
  Hash, 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Globe, 
  Sparkles,
  Filter,
  Clock,
  Star,
  Eye,
  Zap,
  Target,
  BookOpen,
  Camera,
  Music,
  Video,
  Code,
  Palette,
  Gamepad2,
  Utensils,
  Car,
  Plane,
  Home,
  Briefcase,
  GraduationCap,
  Heart as HeartIcon,
  MessageSquare,
  ThumbsUp,
  Award,
  RefreshCw,
  AlertCircle,
  Plus,
  Crown
} from 'lucide-react';
import PostCard from '@/components/PostCard';

interface TrendingPost {
  id: number;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
  rewards: number;
  hashtags: string[];
  category: string;
  mediaUrl?: string;
}

interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  postCount: number;
}

const Explore = () => {
  const [posts, setPosts] = useState<TrendingPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<string[]>([]);
  const { toast } = useToast();

  // Categories with icons and colors
  const categories: Category[] = [
    { id: 'tech', name: 'Technology', icon: Code, color: 'bg-blue-500', description: 'Latest in tech and innovation', postCount: 42 },
    { id: 'art', name: 'Art & Design', icon: Palette, color: 'bg-purple-500', description: 'Creative expressions and designs', postCount: 28 },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2, color: 'bg-green-500', description: 'Gaming news and discussions', postCount: 35 },
    { id: 'food', name: 'Food & Cooking', icon: Utensils, color: 'bg-orange-500', description: 'Culinary adventures and recipes', postCount: 19 },
    { id: 'travel', name: 'Travel', icon: Plane, color: 'bg-cyan-500', description: 'Adventures around the world', postCount: 31 },
    { id: 'lifestyle', name: 'Lifestyle', icon: HeartIcon, color: 'bg-pink-500', description: 'Life tips and inspiration', postCount: 47 },
    { id: 'business', name: 'Business', icon: Briefcase, color: 'bg-gray-500', description: 'Entrepreneurship and work', postCount: 23 },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'bg-indigo-500', description: 'Learning and knowledge sharing', postCount: 15 },
    { id: 'photography', name: 'Photography', icon: Camera, color: 'bg-red-500', description: 'Capturing moments', postCount: 26 },
    { id: 'music', name: 'Music', icon: Music, color: 'bg-yellow-500', description: 'Musical discoveries and discussions', postCount: 33 },
    { id: 'video', name: 'Video & Film', icon: Video, color: 'bg-emerald-500', description: 'Video content and film', postCount: 21 },
    { id: 'automotive', name: 'Automotive', icon: Car, color: 'bg-slate-500', description: 'Cars and transportation', postCount: 12 },
  ];

  // Seeded trending hashtags for early platform
  const seededTrendingHashtags = [
    '#welcome', '#ICP', '#crypto', '#firstpost', '#Web3', '#Blockchain', '#DeFi', '#NFTs', 
    '#Motoko', '#React', '#TypeScript', '#AI', '#MachineLearning', '#OpenSource',
    '#Innovation', '#Startup', '#TechNews', '#Programming', '#Developer',
    '#Design', '#UX', '#UI', '#Creative', '#Art', '#Photography', '#Travel',
    '#Food', '#Cooking', '#Gaming', '#Esports', '#Music', '#Film', '#Education'
  ];

  // Seeded suggested users (development team and early adopters)
  const seededSuggestedUsers = [
    { id: 1, username: 'team4_lead', displayName: 'Team4 Lead', avatar: '/placeholder.svg', followers: 1234, bio: 'Lead developer of ConnectUS platform', level: 'Gold Contributor' },
    { id: 2, username: 'alice_dev', displayName: 'Alice Developer', avatar: '/placeholder.svg', followers: 856, bio: 'Full-stack developer passionate about Web3', level: 'Silver Contributor' },
    { id: 3, username: 'bob_designer', displayName: 'Bob Designer', avatar: '/placeholder.svg', followers: 2103, bio: 'UI/UX designer creating beautiful experiences', level: 'Gold Contributor' },
    { id: 4, username: 'crypto_carol', displayName: 'Carol Crypto', avatar: '/placeholder.svg', followers: 567, bio: 'Blockchain enthusiast and DeFi researcher', level: 'Bronze Contributor' },
    { id: 5, username: 'tech_tom', displayName: 'Tom Tech', avatar: '/placeholder.svg', followers: 789, bio: 'Tech blogger and startup founder', level: 'Silver Contributor' },
    { id: 6, username: 'art_anna', displayName: 'Anna Artist', avatar: '/placeholder.svg', followers: 432, bio: 'Digital artist exploring NFT creation', level: 'Bronze Contributor' },
  ];

  // Seeded trending posts for early platform
  const seededTrendingPosts: TrendingPost[] = [
    {
      id: 999,
      author: 'team4_lead',
      content: 'Welcome to ConnectUS! 🎉 This is the future of decentralized social networking. Built on the Internet Computer Protocol (ICP), we\'re creating a truly decentralized platform where users own their data and earn rewards for their contributions. #welcome #ICP #crypto #firstpost',
      timestamp: Date.now() - 3600000, // 1 hour ago
      likes: 156,
      rewards: 89,
      hashtags: ['#welcome', '#ICP', '#crypto', '#firstpost'],
      category: 'tech',
      mediaUrl: ''
    },
    {
      id: 998,
      author: 'alice_dev',
      content: 'Just deployed our first smart contract on ICP! The development experience is incredible. Motoko is such a powerful language for blockchain development. Can\'t wait to see what we build next! #ICP #Motoko #Web3 #development',
      timestamp: Date.now() - 7200000, // 2 hours ago
      likes: 89,
      rewards: 45,
      hashtags: ['#ICP', '#Motoko', '#Web3', '#development'],
      category: 'tech',
      mediaUrl: ''
    },
    {
      id: 997,
      author: 'bob_designer',
      content: 'Designing for Web3 is a whole new challenge! The user experience needs to be intuitive while explaining complex blockchain concepts. Here\'s what I\'ve learned about creating accessible decentralized interfaces. #UX #UI #Web3 #design',
      timestamp: Date.now() - 10800000, // 3 hours ago
      likes: 67,
      rewards: 34,
      hashtags: ['#UX', '#UI', '#Web3', '#design'],
      category: 'art',
      mediaUrl: ''
    },
    {
      id: 996,
      author: 'crypto_carol',
      content: 'The future of social media is here! No more centralized control, no more data mining, no more censorship. ConnectUS gives power back to the users. This is what Web3 is all about! #crypto #Web3 #decentralized #social',
      timestamp: Date.now() - 14400000, // 4 hours ago
      likes: 123,
      rewards: 67,
      hashtags: ['#crypto', '#Web3', '#decentralized', '#social'],
      category: 'tech',
      mediaUrl: ''
    },
    {
      id: 995,
      author: 'tech_tom',
      content: 'As a startup founder, I\'m excited about the possibilities that ICP offers. The ability to build truly decentralized applications without the traditional blockchain limitations is game-changing. #startup #innovation #ICP #tech',
      timestamp: Date.now() - 18000000, // 5 hours ago
      likes: 78,
      rewards: 41,
      hashtags: ['#startup', '#innovation', '#ICP', '#tech'],
      category: 'business',
      mediaUrl: ''
    }
  ];

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const canisterPosts = await team4Social.getPosts();
      const mapped = (canisterPosts as any[]).map((post: any) => ({
        id: Number(post.id),
        author: post.author.toText ? post.author.toText() : String(post.author),
        content: post.content,
        timestamp: Number(post.timestamp),
        likes: Number(post.likes),
        rewards: Number(post.rewards),
        hashtags: extractHashtags(post.content),
        category: determineCategory(post.content),
        mediaUrl: post.mediaUrl,
      }));
      
      // Sort by engagement (likes + rewards)
      const sorted = mapped.sort((a, b) => (b.likes + b.rewards) - (a.likes + a.rewards));
      
      // Combine seeded posts with real posts, prioritizing real posts
      const combinedPosts = [...sorted, ...seededTrendingPosts];
      setPosts(combinedPosts);
      
      // Set trending hashtags
      const allHashtags = combinedPosts.flatMap(post => post.hashtags);
      const hashtagCounts = allHashtags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const trending = Object.entries(hashtagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tag]) => tag);
      
      setTrendingHashtags(trending.length > 0 ? trending : seededTrendingHashtags.slice(0, 10));
      setSuggestedUsers(seededSuggestedUsers);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load explore content. Please try again.');
      
      // Fallback to seeded content
      setPosts(seededTrendingPosts);
      setTrendingHashtags(seededTrendingHashtags.slice(0, 10));
      setSuggestedUsers(seededSuggestedUsers);
      
      toast({
        title: "Warning",
        description: "Using demo content while we load your data.",
        variant: "default"
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const extractHashtags = (content: string): string[] => {
    const hashtagRegex = /#[\w]+/g;
    return content.match(hashtagRegex) || [];
  };

  const determineCategory = (content: string): string => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('tech') || lowerContent.includes('programming') || lowerContent.includes('code')) return 'tech';
    if (lowerContent.includes('art') || lowerContent.includes('design') || lowerContent.includes('creative')) return 'art';
    if (lowerContent.includes('game') || lowerContent.includes('gaming') || lowerContent.includes('esports')) return 'gaming';
    if (lowerContent.includes('food') || lowerContent.includes('cook') || lowerContent.includes('recipe')) return 'food';
    if (lowerContent.includes('travel') || lowerContent.includes('trip') || lowerContent.includes('adventure')) return 'travel';
    if (lowerContent.includes('lifestyle') || lowerContent.includes('life') || lowerContent.includes('inspiration')) return 'lifestyle';
    if (lowerContent.includes('business') || lowerContent.includes('startup') || lowerContent.includes('entrepreneur')) return 'business';
    if (lowerContent.includes('learn') || lowerContent.includes('education') || lowerContent.includes('study')) return 'education';
    if (lowerContent.includes('photo') || lowerContent.includes('camera') || lowerContent.includes('image')) return 'photography';
    if (lowerContent.includes('music') || lowerContent.includes('song') || lowerContent.includes('audio')) return 'music';
    if (lowerContent.includes('video') || lowerContent.includes('film') || lowerContent.includes('movie')) return 'video';
    if (lowerContent.includes('car') || lowerContent.includes('automotive') || lowerContent.includes('vehicle')) return 'automotive';
    return 'general';
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleLike = async (postId: number) => {
    try {
      await team4Social.likePost(postId);
      // Refresh posts to update like count
      const updatedPosts = posts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      );
      setPosts(updatedPosts);
      toast({
        title: "Liked!",
        description: "Post added to your liked content."
      });
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: "Error",
        description: "Failed to like post.",
        variant: "destructive"
      });
    }
  };

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

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const getUserLevelIcon = (level: string) => {
    switch (level) {
      case 'Gold Contributor': return Crown;
      case 'Silver Contributor': return Star;
      default: return TrendingUp;
    }
  };

  const getUserLevelColor = (level: string) => {
    switch (level) {
      case 'Gold Contributor': return 'text-yellow-500';
      case 'Silver Contributor': return 'text-gray-400';
      default: return 'text-orange-600';
    }
  };

  if (error && posts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center py-12">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Could not load explore content</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchPosts} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories & Search */}
          <div className="space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Discover
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search posts, users, hashtags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter by category:</span>
                </div>
                
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                    className="w-full justify-start"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    All Categories
                  </Button>
                  
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="w-full justify-start"
                    >
                      <category.icon className="w-4 h-4 mr-2" />
                      {category.name}
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {category.postCount}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Hashtags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending Hashtags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {trendingHashtags.map((hashtag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => setSearchQuery(hashtag)}
                    >
                      {hashtag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suggestedUsers.map((user) => {
                    const LevelIcon = getUserLevelIcon(user.level);
                    return (
                      <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="text-xs">
                            {user.displayName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="font-medium text-sm truncate">{user.displayName}</p>
                            <LevelIcon className={`w-3 h-3 ${getUserLevelColor(user.level)}`} />
                          </div>
                          <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                          <p className="text-xs text-muted-foreground">{user.followers} followers</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Follow
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Trending Posts */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Sparkles className="w-8 h-8 text-primary" />
                  Explore
                </h1>
                <p className="text-muted-foreground mt-1">
                  Discover trending content and connect with creators
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {filteredPosts.length} posts
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Live
                </Badge>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error} Showing demo content to help you explore the platform.
                </AlertDescription>
              </Alert>
            )}

            {/* Content */}
            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                          <div className="space-y-2">
                            <div className="h-4 bg-muted rounded animate-pulse" />
                            <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                          </div>
                          <div className="flex gap-2">
                            <div className="h-6 bg-muted rounded animate-pulse w-16" />
                            <div className="h-6 bg-muted rounded animate-pulse w-20" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? `No posts match "${searchQuery}"` : 'No posts in this category yet'}
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button 
                        variant="outline" 
                        onClick={() => setSearchQuery('')}
                      >
                        Clear Search
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedCategory('all')}
                      >
                        View All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
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
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;