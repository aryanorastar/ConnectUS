import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
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
  Crown,
  HelpCircle,
  Info,
  Flame,
  TrendingDown,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Activity,
  Trophy,
  Gift,
  Calendar,
  MapPin,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  Image as ImageIcon,
  FileText,
  Link,
  Hash as HashIcon,
  AtSign,
  Filter as FilterIcon,
  SortAsc,
  SortDesc
} from 'lucide-react';
import PostCard from '@/components/PostCard';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

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
  contentType?: 'text' | 'image' | 'video' | 'link';
  engagement?: number;
}

interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  postCount: number;
  isPopular?: boolean;
}

interface TopContributor {
  id: number;
  username: string;
  displayName: string;
  avatar: string;
  followers: number;
  bio: string;
  level: string;
  recentActivity: string;
  cuEarned: number;
  postsCount: number;
  lastActive: number;
}

const Explore = () => {
  const [posts, setPosts] = useState<TrendingPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [suggestedUsers, setSuggestedUsers] = useState<TopContributor[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<string[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [sortBy, setSortBy] = useState<'trending' | 'recent' | 'rewards'>('trending');
  const [filterByContent, setFilterByContent] = useState<string>('all');
  const { toast } = useToast();

  // Enhanced categories with popularity indicators
  const categories: Category[] = [
    { id: 'tech', name: 'Technology', icon: Code, color: 'bg-blue-500', description: 'Latest in tech and innovation', postCount: 42, isPopular: true },
    { id: 'art', name: 'Art & Design', icon: Palette, color: 'bg-purple-500', description: 'Creative expressions and designs', postCount: 28, isPopular: true },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2, color: 'bg-green-500', description: 'Gaming news and discussions', postCount: 35, isPopular: true },
    { id: 'lifestyle', name: 'Lifestyle', icon: HeartIcon, color: 'bg-pink-500', description: 'Life tips and inspiration', postCount: 47, isPopular: true },
    { id: 'food', name: 'Food & Cooking', icon: Utensils, color: 'bg-orange-500', description: 'Culinary adventures and recipes', postCount: 19 },
    { id: 'travel', name: 'Travel', icon: Plane, color: 'bg-cyan-500', description: 'Adventures around the world', postCount: 31 },
    { id: 'business', name: 'Business', icon: Briefcase, color: 'bg-gray-500', description: 'Entrepreneurship and work', postCount: 23 },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'bg-indigo-500', description: 'Learning and knowledge sharing', postCount: 15 },
    { id: 'photography', name: 'Photography', icon: Camera, color: 'bg-red-500', description: 'Capturing moments', postCount: 26 },
    { id: 'music', name: 'Music', icon: Music, color: 'bg-yellow-500', description: 'Musical discoveries and discussions', postCount: 33 },
    { id: 'video', name: 'Video & Film', icon: Video, color: 'bg-emerald-500', description: 'Video content and film', postCount: 21 },
    { id: 'automotive', name: 'Automotive', icon: Car, color: 'bg-slate-500', description: 'Cars and transportation', postCount: 12 },
  ];

  // Enhanced trending hashtags with popularity indicators
  const seededTrendingHashtags = [
    { tag: '#welcome', trend: 'up', count: 156 },
    { tag: '#ICP', trend: 'up', count: 234 },
    { tag: '#crypto', trend: 'up', count: 189 },
    { tag: '#Web3', trend: 'up', count: 145 },
    { tag: '#Blockchain', trend: 'up', count: 123 },
    { tag: '#DeFi', trend: 'down', count: 98 },
    { tag: '#NFTs', trend: 'up', count: 167 },
    { tag: '#Motoko', trend: 'up', count: 89 },
    { tag: '#React', trend: 'up', count: 134 },
    { tag: '#TypeScript', trend: 'up', count: 112 },
    { tag: '#AI', trend: 'up', count: 201 },
    { tag: '#MachineLearning', trend: 'up', count: 178 },
    { tag: '#OpenSource', trend: 'up', count: 156 },
    { tag: '#Innovation', trend: 'up', count: 145 },
    { tag: '#Startup', trend: 'up', count: 123 },
    { tag: '#TechNews', trend: 'up', count: 167 },
    { tag: '#Programming', trend: 'up', count: 189 },
    { tag: '#Developer', trend: 'up', count: 234 },
    { tag: '#Design', trend: 'up', count: 145 },
    { tag: '#UX', trend: 'up', count: 123 },
    { tag: '#UI', trend: 'up', count: 134 },
    { tag: '#Creative', trend: 'up', count: 156 },
    { tag: '#Art', trend: 'up', count: 167 },
    { tag: '#Photography', trend: 'up', count: 145 },
    { tag: '#Travel', trend: 'up', count: 123 },
    { tag: '#Food', trend: 'up', count: 134 },
    { tag: '#Cooking', trend: 'up', count: 112 },
    { tag: '#Gaming', trend: 'up', count: 189 },
    { tag: '#Esports', trend: 'up', count: 145 },
    { tag: '#Music', trend: 'up', count: 167 },
    { tag: '#Film', trend: 'up', count: 123 },
    { tag: '#Education', trend: 'up', count: 134 }
  ];

  // Enhanced suggested users with dynamic activity
  const seededSuggestedUsers: TopContributor[] = [
    { 
      id: 1, 
      username: 'team4_lead', 
      displayName: 'Team4 Lead', 
      avatar: '/placeholder.svg', 
      followers: 1234, 
      bio: 'Lead developer of ConnectUS platform', 
      level: 'Gold Contributor',
      recentActivity: 'Just posted about ICP development',
      cuEarned: 2345,
      postsCount: 67,
      lastActive: Date.now() - 1800000 // 30 minutes ago
    },
    { 
      id: 2, 
      username: 'alice_dev', 
      displayName: 'Alice Developer', 
      avatar: '/placeholder.svg', 
      followers: 856, 
      bio: 'Full-stack developer passionate about Web3', 
      level: 'Silver Contributor',
      recentActivity: 'Shared a tutorial on Motoko',
      cuEarned: 1234,
      postsCount: 45,
      lastActive: Date.now() - 3600000 // 1 hour ago
    },
    { 
      id: 3, 
      username: 'bob_designer', 
      displayName: 'Bob Designer', 
      avatar: '/placeholder.svg', 
      followers: 2103, 
      bio: 'UI/UX designer creating beautiful experiences', 
      level: 'Gold Contributor',
      recentActivity: 'Posted design tips for Web3 apps',
      cuEarned: 3456,
      postsCount: 89,
      lastActive: Date.now() - 7200000 // 2 hours ago
    },
    { 
      id: 4, 
      username: 'crypto_carol', 
      displayName: 'Carol Crypto', 
      avatar: '/placeholder.svg', 
      followers: 567, 
      bio: 'Blockchain enthusiast and DeFi researcher', 
      level: 'Bronze Contributor',
      recentActivity: 'Analyzed latest DeFi trends',
      cuEarned: 456,
      postsCount: 23,
      lastActive: Date.now() - 10800000 // 3 hours ago
    },
    { 
      id: 5, 
      username: 'tech_tom', 
      displayName: 'Tom Tech', 
      avatar: '/placeholder.svg', 
      followers: 789, 
      bio: 'Tech blogger and startup founder', 
      level: 'Silver Contributor',
      recentActivity: 'Reviewed new ICP features',
      cuEarned: 987,
      postsCount: 34,
      lastActive: Date.now() - 14400000 // 4 hours ago
    },
    { 
      id: 6, 
      username: 'art_anna', 
      displayName: 'Anna Artist', 
      avatar: '/placeholder.svg', 
      followers: 432, 
      bio: 'Digital artist exploring NFT creation', 
      level: 'Bronze Contributor',
      recentActivity: 'Created new NFT collection',
      cuEarned: 234,
      postsCount: 12,
      lastActive: Date.now() - 18000000 // 5 hours ago
    },
  ];

  // Enhanced trending posts with content types and engagement metrics
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
      mediaUrl: '',
      contentType: 'text',
      engagement: 245
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
      mediaUrl: '',
      contentType: 'text',
      engagement: 134
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
      mediaUrl: '',
      contentType: 'text',
      engagement: 101
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
      mediaUrl: '',
      contentType: 'text',
      engagement: 190
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
      mediaUrl: '',
      contentType: 'text',
      engagement: 119
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
        contentType: determineContentType(post.content, post.mediaUrl),
        engagement: Number(post.likes) + Number(post.rewards) / 10,
      }));
      
      // Combine with seeded posts for better demo experience
      const allPosts = [...seededTrendingPosts, ...mapped];
      setPosts(allPosts);
      
      // Extract trending hashtags from posts
      const allHashtags = allPosts.flatMap(post => post.hashtags);
      const hashtagCounts = allHashtags.reduce((acc: any, hashtag) => {
        acc[hashtag] = (acc[hashtag] || 0) + 1;
        return acc;
      }, {});
      
      const trending = Object.entries(hashtagCounts)
        .sort(([,a]: any, [,b]: any) => b - a)
        .slice(0, 20)
        .map(([tag]) => tag);
      
      setTrendingHashtags(trending);
      setSuggestedUsers(seededSuggestedUsers);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Showing demo content.');
      setPosts(seededTrendingPosts);
      setTrendingHashtags(seededTrendingHashtags.map(h => h.tag));
      setSuggestedUsers(seededSuggestedUsers);
    }
    setLoading(false);
  };

  const extractHashtags = (content: string): string[] => {
    const hashtagRegex = /#[\w]+/g;
    return content.match(hashtagRegex) || [];
  };

  const determineCategory = (content: string): string => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('tech') || lowerContent.includes('programming') || lowerContent.includes('code')) return 'tech';
    if (lowerContent.includes('art') || lowerContent.includes('design') || lowerContent.includes('creative')) return 'art';
    if (lowerContent.includes('game') || lowerContent.includes('gaming')) return 'gaming';
    if (lowerContent.includes('food') || lowerContent.includes('cook')) return 'food';
    if (lowerContent.includes('travel') || lowerContent.includes('trip')) return 'travel';
    if (lowerContent.includes('lifestyle') || lowerContent.includes('life')) return 'lifestyle';
    if (lowerContent.includes('business') || lowerContent.includes('startup')) return 'business';
    if (lowerContent.includes('education') || lowerContent.includes('learn')) return 'education';
    if (lowerContent.includes('photo') || lowerContent.includes('camera')) return 'photography';
    if (lowerContent.includes('music') || lowerContent.includes('song')) return 'music';
    if (lowerContent.includes('video') || lowerContent.includes('film')) return 'video';
    if (lowerContent.includes('car') || lowerContent.includes('auto')) return 'automotive';
    return 'tech'; // default
  };

  const determineContentType = (content: string, mediaUrl?: string): 'text' | 'image' | 'video' | 'link' => {
    if (mediaUrl) {
      if (mediaUrl.includes('.mp4') || mediaUrl.includes('.mov')) return 'video';
      if (mediaUrl.includes('.jpg') || mediaUrl.includes('.png')) return 'image';
    }
    if (content.includes('http://') || content.includes('https://')) return 'link';
    return 'text';
  };

  const handleLike = async (postId: number) => {
    try {
      await team4Social.likePost(postId);
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
      toast({
        title: "Post liked!",
        description: "Your like has been recorded on the blockchain.",
      });
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShare = async (postId: number) => {
    try {
      // In a real implementation, this would trigger a share action
      toast({
        title: "Post shared!",
        description: "Your share has been recorded.",
      });
    } catch (error) {
      console.error('Error sharing post:', error);
      toast({
        title: "Error",
        description: "Failed to share post. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getUserLevelIcon = (level: string) => {
    if (level.includes('Gold')) return Crown;
    if (level.includes('Silver')) return Star;
    return Target;
  };

  const getUserLevelColor = (level: string) => {
    if (level.includes('Gold')) return 'text-yellow-500';
    if (level.includes('Silver')) return 'text-gray-400';
    return 'text-orange-600';
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'image': return ImageIcon;
      case 'video': return Play;
      case 'link': return ExternalLink;
      default: return FileText;
    }
  };

  const getContentTypeColor = (contentType: string) => {
    switch (contentType) {
      case 'image': return 'text-blue-500';
      case 'video': return 'text-purple-500';
      case 'link': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getPopularCategories = () => categories.filter(cat => cat.isPopular);
  const getOtherCategories = () => categories.filter(cat => !cat.isPopular);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesContentType = filterByContent === 'all' || post.contentType === filterByContent;
    
    return matchesSearch && matchesCategory && matchesContentType;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return b.engagement - a.engagement;
      case 'recent':
        return b.timestamp - a.timestamp;
      case 'rewards':
        return b.rewards - a.rewards;
      default:
        return b.engagement - a.engagement;
    }
  });

  useEffect(() => {
    fetchPosts();
  }, []);

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
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Enhanced Search & Categories */}
            <div className="space-y-6">
              {/* Enhanced Search */}
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
                  
                  {/* Content Type Filter */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FilterIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Content Type:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'all', label: 'All', icon: Globe },
                        { id: 'text', label: 'Text', icon: FileText },
                        { id: 'image', label: 'Images', icon: ImageIcon },
                        { id: 'video', label: 'Videos', icon: Play }
                      ].map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <Button
                            key={type.id}
                            variant={filterByContent === type.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterByContent(type.id)}
                            className="justify-start text-xs"
                          >
                            <IconComponent className="w-3 h-3 mr-1" />
                            {type.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Popular Categories */}
                  <div className="space-y-2">
                                         <div className="flex items-center gap-2">
                       <Flame className="w-4 h-4 text-orange-500" />
                       <span className="text-sm font-medium">Popular Categories</span>
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
                      
                      {getPopularCategories().map((category) => (
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
                  </div>

                  {/* Other Categories - Collapsible */}
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between">
                        <span>More Categories</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 mt-2">
                      {getOtherCategories().map((category) => (
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
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>

              {/* Prominent Trending Hashtags */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="text-primary">Trending Now</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="space-y-2">
                          <p className="font-medium">Trending Hashtags</p>
                          <p className="text-sm text-muted-foreground">
                            Click on any hashtag to discover related content and join the conversation.
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {seededTrendingHashtags.slice(0, 8).map((hashtag, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-2">
                          <HashIcon className="w-4 h-4 text-primary" />
                          <span className="font-medium text-sm">{hashtag.tag}</span>
                          {hashtag.trend === 'up' ? (
                            <TrendingUp className="w-3 h-3 text-green-500" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-500" />
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {hashtag.count}
                        </Badge>
                      </div>
                    ))}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-primary hover:text-primary/80"
                      onClick={() => setSearchQuery('#trending')}
                    >
                      View All Trending
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Top Contributors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Top Contributors
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="space-y-2">
                          <p className="font-medium">Contributor Levels</p>
                          <div className="text-xs space-y-1">
                            <p><strong>Gold:</strong> 1000+ CU earned, elite status</p>
                            <p><strong>Silver:</strong> 500-1000 CU earned, active member</p>
                            <p><strong>Bronze:</strong> 0-500 CU earned, new contributor</p>
                          </div>
                          <p className="text-xs text-muted-foreground">Earn CU tokens by creating quality content and engaging with the community.</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {suggestedUsers.map((user) => {
                      const LevelIcon = getUserLevelIcon(user.level);
                      const isActive = Date.now() - user.lastActive < 300000; // 5 minutes
                      return (
                        <Tooltip key={user.id}>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-help border border-transparent hover:border-primary/20">
                              <div className="relative">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {user.displayName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                {isActive && (
                                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                  <p className="font-medium text-sm truncate">{user.displayName}</p>
                                  <LevelIcon className={`w-3 h-3 ${getUserLevelColor(user.level)}`} />
                                </div>
                                <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{user.followers} followers</span>
                                  <span>•</span>
                                  <span>{user.cuEarned} CU</span>
                                </div>
                                <p className="text-xs text-primary mt-1 truncate">{user.recentActivity}</p>
                              </div>
                              <Button size="sm" variant="outline">
                                Follow
                              </Button>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div className="space-y-2">
                              <p className="font-medium">{user.displayName}</p>
                              <p className="text-sm text-muted-foreground">{user.bio}</p>
                              <div className="flex items-center gap-1">
                                <LevelIcon className={`w-3 h-3 ${getUserLevelColor(user.level)}`} />
                                <span className="text-xs">{user.level}</span>
                              </div>
                              <div className="text-xs space-y-1">
                                <p><strong>Posts:</strong> {user.postsCount}</p>
                                <p><strong>CU Earned:</strong> {user.cuEarned}</p>
                                <p><strong>Last Active:</strong> {formatTimestamp(user.lastActive)}</p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Enhanced Trending Posts */}
            <div className="lg:col-span-3 space-y-6">
              {/* Enhanced Header */}
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
                    {sortedPosts.length} posts
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Live
                  </Badge>
                </div>
              </div>

              {/* Enhanced Sort & Filter Controls */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <SortAsc className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Sort by:</span>
                      </div>
                      <div className="flex gap-2">
                        {[
                          { id: 'trending', label: 'Trending', icon: TrendingUp },
                          { id: 'recent', label: 'Recent', icon: Clock },
                          { id: 'rewards', label: 'Top Rewards', icon: Gift }
                        ].map((sort) => {
                          const IconComponent = sort.icon;
                          return (
                            <Button
                              key={sort.id}
                              variant={sortBy === sort.id ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setSortBy(sort.id as any)}
                              className="flex items-center gap-1"
                            >
                              <IconComponent className="w-3 h-3" />
                              {sort.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="w-4 h-4" />
                      <span>CU tokens reward quality content</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Error Alert */}
              {error && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error} Showing demo content to help you explore the platform.
                  </AlertDescription>
                </Alert>
              )}

              {/* Enhanced Content */}
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
              ) : sortedPosts.length === 0 ? (
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
                  {sortedPosts.map((post) => (
                    <Card key={post.id} className="relative overflow-hidden">
                      {/* Content Type Badge */}
                      {post.contentType && post.contentType !== 'text' && (
                        <div className="absolute top-4 right-4 z-10">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            {(() => {
                              const IconComponent = getContentTypeIcon(post.contentType);
                              return <IconComponent className="w-3 h-3" />;
                            })()}
                            {post.contentType}
                          </Badge>
                        </div>
                      )}
                      
                      {/* Engagement Score */}
                      <div className="absolute top-4 left-4 z-10">
                        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                          <Activity className="w-3 h-3 mr-1" />
                          {Math.round(post.engagement)}
                        </Badge>
                      </div>

                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="text-sm">
                              {post.author[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">@{post.author}</p>
                                <p className="text-xs text-muted-foreground">{formatTimestamp(post.timestamp)}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {post.category}
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-sm leading-relaxed">{post.content}</p>
                            
                            {/* Hashtags */}
                            {post.hashtags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {post.hashtags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                    onClick={() => setSearchQuery(tag)}
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            {/* Enhanced Actions */}
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center gap-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLike(post.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Heart className="w-4 h-4" />
                                  <span className="text-xs">{post.likes}</span>
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleShare(post.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Share2 className="w-4 h-4" />
                                  <span className="text-xs">Share</span>
                                </Button>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge variant="secondary" className="flex items-center gap-1 cursor-help">
                                      <Gift className="w-3 h-3" />
                                      {post.rewards} CU
                                      <HelpCircle className="w-3 h-3" />
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <div className="space-y-2">
                                      <p className="font-medium">CU Tokens Earned</p>
                                      <p className="text-sm text-muted-foreground">
                                        This post has earned {post.rewards} CU tokens through community engagement. 
                                        Quality content receives more rewards!
                                      </p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Explore;