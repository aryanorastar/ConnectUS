import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PostCard from '@/components/PostCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { team4Social } from '@/lib/icp';
import { useToast } from '@/hooks/use-toast';
import { 
  Edit, 
  Camera, 
  Users, 
  UserPlus, 
  UserMinus, 
  Gift, 
  Wallet, 
  History, 
  Globe, 
  MapPin, 
  Calendar,
  Crown,
  Star,
  TrendingUp,
  MessageCircle,
  Heart,
  Share2,
  Plus,
  Info,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Trophy,
  Target,
  Zap,
  Award,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Play,
  BookOpen,
  PenTool,
  Hash,
  AtSign
} from 'lucide-react';

interface Profile {
  principal: any;
  username: string;
  bio: string;
  location: string;
  website: string;
  bannerUrl: string;
  avatarUrl: string;
  displayName: string;
  totalRewards: number;
  postsCount: number;
  joinDate: string;
}

interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'earned';
  amount: number;
  recipient?: string;
  sender?: string;
  timestamp: number;
  description: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewingFollowers, setViewingFollowers] = useState(false);
  const [viewingFollowing, setViewingFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  // Profile completion tracking
  const getProfileCompletion = (profile: Profile) => {
    const fields = [
      profile.displayName,
      profile.bio,
      profile.location,
      profile.website,
      profile.avatarUrl,
      profile.bannerUrl
    ];
    const completedFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  // Achievements system
  const getAchievements = (profile: Profile, posts: any[], rewards: number): Achievement[] => [
    {
      id: 'first-post',
      title: 'First Steps',
      description: 'Create your first post',
      icon: PenTool,
      unlocked: posts.length > 0,
      progress: posts.length,
      maxProgress: 1
    },
    {
      id: 'social-butterfly',
      title: 'Social Butterfly',
      description: 'Get 10 followers',
      icon: Users,
      unlocked: followers.length >= 10,
      progress: followers.length,
      maxProgress: 10
    },
    {
      id: 'content-creator',
      title: 'Content Creator',
      description: 'Create 5 posts',
      icon: MessageCircle,
      unlocked: posts.length >= 5,
      progress: posts.length,
      maxProgress: 5
    },
    {
      id: 'reward-earner',
      title: 'Reward Earner',
      description: 'Earn 100 CU tokens',
      icon: Trophy,
      unlocked: rewards >= 100,
      progress: rewards,
      maxProgress: 100
    },
    {
      id: 'profile-complete',
      title: 'Profile Perfect',
      description: 'Complete your profile',
      icon: CheckCircle,
      unlocked: getProfileCompletion(profile) >= 80,
      progress: getProfileCompletion(profile),
      maxProgress: 100
    }
  ];

  const fetchProfileAndPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await team4Social.getMyProfile();
      setProfile(user);
      
      // Fetch user posts
      const allPosts = await team4Social.getPosts();
      const principal = user?.principal?.toText ? user.principal.toText() : user?.principal;
      const posts = allPosts.filter((post: any) => {
        const author = post.author?.toText ? post.author.toText() : post.author;
        return author === principal;
      }).map((post: any) => ({
        id: Number(post.id),
        author: principal,
        content: post.content,
        timestamp: Number(post.timestamp),
        likes: Number(post.likes),
        rewards: Number(post.rewards),
        mediaUrl: post.mediaUrl,
      })).reverse();
      setUserPosts(posts);
      
      // Fetch followers and following
      try {
        const followersList = await team4Social.getFollowers(user.principal);
        const followingList = await team4Social.getFollowing(user.principal);
        setFollowers(followersList);
        setFollowing(followingList);
      } catch (followError) {
        console.warn('Could not fetch followers/following:', followError);
        setFollowers([]);
        setFollowing([]);
      }
      
      // Fetch token balance
      try {
        const balance = await team4Social.getMyBalance();
        setTokenBalance(Number(balance));
      } catch (balanceError) {
        console.warn('Could not fetch token balance:', balanceError);
        setTokenBalance(0);
      }
      
      // Mock transaction history (in production, fetch from blockchain)
      setTransactions([
        {
          id: '1',
          type: 'earned',
          amount: 50,
          timestamp: Date.now() - 86400000,
          description: 'Earned from post engagement'
        },
        {
          id: '2',
          type: 'sent',
          amount: 25,
          recipient: 'user123',
          timestamp: Date.now() - 172800000,
          description: 'Sent to @user123'
        },
        {
          id: '3',
          type: 'received',
          amount: 100,
          sender: 'user456',
          timestamp: Date.now() - 259200000,
          description: 'Received from @user456'
        }
      ]);
      
      // Check if user needs onboarding
      const completion = getProfileCompletion(user);
      if (completion < 50) {
        setShowOnboarding(true);
      }
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfileAndPosts();
  }, []);

  const handleSaveProfile = async () => {
    setIsEditing(false);
    try {
      await team4Social.updateProfile(
        profile?.displayName || profile?.username || '',
        profile?.bio || '',
        profile?.location || '',
        profile?.website || '',
        profile?.bannerUrl || '',
        profile?.avatarUrl || ''
      );
      toast({ 
        title: 'Profile updated!',
        description: "Your profile has been saved to the blockchain."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({ 
        title: 'Error updating profile',
        description: "Failed to save profile changes.",
        variant: "destructive"
      });
    }
  };

  const handleLike = async (postId: number) => {
    try {
      await team4Social.likePost(postId);
      // Refresh user posts
      const allPosts = await team4Social.getPosts();
      const principal = profile?.principal?.toText ? profile.principal.toText() : profile?.principal;
      const posts = allPosts.filter((post: any) => {
        const author = post.author?.toText ? post.author.toText() : post.author;
        return author === principal;
      }).map((post: any) => ({
        id: Number(post.id),
        author: principal,
        content: post.content,
        timestamp: Number(post.timestamp),
        likes: Number(post.likes),
        rewards: Number(post.rewards),
        mediaUrl: post.mediaUrl,
      })).reverse();
      setUserPosts(posts);
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSendTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendTo || !sendAmount) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseInt(sendAmount);
    if (amount <= 0 || amount > tokenBalance) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount within your balance.",
        variant: "destructive"
      });
      return;
    }

    setSending(true);
    try {
      // In a real implementation, this would call the blockchain
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      
      // Update local state
      setTokenBalance(prev => prev - amount);
      setSendTo('');
      setSendAmount('');
      
      // Add to transaction history
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'sent',
        amount,
        recipient: sendTo,
        timestamp: Date.now(),
        description: `Sent to @${sendTo}`
      };
      setTransactions(prev => [newTransaction, ...prev]);
      
      toast({
        title: "Tokens Sent!",
        description: `${amount} CU tokens sent to @${sendTo}`,
      });
    } catch (error) {
      console.error('Error sending tokens:', error);
      toast({
        title: "Error",
        description: "Failed to send tokens. Please try again.",
        variant: "destructive"
      });
    }
    setSending(false);
  };

  const handleFollow = async () => {
    // Implementation for following
    setIsFollowing(true);
  };

  const handleUnfollow = async () => {
    // Implementation for unfollowing
    setIsFollowing(false);
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

  const getUserLevel = (rewards: number) => {
    if (rewards >= 1000) return { level: 'Gold', icon: Crown, description: 'Elite member with 1000+ CU earned' };
    if (rewards >= 500) return { level: 'Silver', icon: Star, description: 'Active member with 500+ CU earned' };
    return { level: 'Bronze', icon: Target, description: 'New member building their presence' };
  };

  const handleAvatarUpload = () => {
    // In a real implementation, this would open a file picker
    toast({
      title: "Avatar Upload",
      description: "Avatar upload feature coming soon!",
    });
  };

  const handleBannerUpload = () => {
    // In a real implementation, this would open a file picker
    toast({
      title: "Banner Upload",
      description: "Banner upload feature coming soon!",
    });
  };

  const onboardingSteps = [
    {
      title: "Welcome to ConnectUS!",
      description: "Let's set up your profile to get the most out of the platform.",
      icon: Sparkles
    },
    {
      title: "Add Your Bio",
      description: "Tell others about yourself to build meaningful connections.",
      icon: PenTool
    },
    {
      title: "Upload a Photo",
      description: "Add a profile picture to make your profile more personal.",
      icon: Camera
    },
    {
      title: "Start Posting",
      description: "Share your thoughts and earn CU tokens for engagement.",
      icon: MessageCircle
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center py-12">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Could not load profile</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchProfileAndPosts} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground">Unable to load profile data.</p>
          </div>
        </div>
      </div>
    );
  }

  const userStats = {
    posts: profile?.postsCount || userPosts.length,
    followers: followers.length,
    following: following.length,
    totalRewards: profile?.totalRewards || 0,
    level: getUserLevel(profile?.totalRewards || 0),
    joinDate: profile?.joinDate || 'January 2024'
  };

  const achievements = getAchievements(profile, userPosts, userStats.totalRewards);
  const profileCompletion = getProfileCompletion(profile);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Onboarding Modal */}
        {showOnboarding && (
          <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
            <DialogContent className="max-w-md">
                              <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {(() => {
                      const IconComponent = onboardingSteps[onboardingStep].icon;
                      return <IconComponent className="w-5 h-5" />;
                    })()}
                    {onboardingSteps[onboardingStep].title}
                  </DialogTitle>
                </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {onboardingSteps[onboardingStep].description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Step {onboardingStep + 1} of {onboardingSteps.length}
                  </div>
                  <div className="flex gap-2">
                    {onboardingStep > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOnboardingStep(prev => prev - 1)}
                      >
                        Previous
                      </Button>
                    )}
                    {onboardingStep < onboardingSteps.length - 1 ? (
                      <Button
                        size="sm"
                        onClick={() => setOnboardingStep(prev => prev + 1)}
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setShowOnboarding(false)}
                      >
                        Get Started
                        <Play className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Profile Info */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card className="overflow-hidden">
                {/* Profile Banner */}
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={handleBannerUpload}
                    >
                      <Camera className="w-4 h-4 mr-1" />
                      Change Banner
                    </Button>
                  )}
                </div>
                
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    {/* Avatar */}
                    <div className="relative -mt-16">
                      <Avatar className="w-32 h-32 mx-auto border-4 border-background shadow-lg">
                        <AvatarImage src={profile?.avatarUrl || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-tr from-indigo-500 to-purple-400 text-white text-4xl">
                          {profile?.displayName?.[0]?.toUpperCase() || profile?.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                          onClick={handleAvatarUpload}
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      ) : !profile?.avatarUrl && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                          onClick={() => setIsEditing(true)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          value={profile?.displayName || ''}
                          onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                          placeholder="Display Name"
                        />
                        <Input
                          value={profile?.username || ''}
                          onChange={(e) => setProfile({...profile, username: e.target.value})}
                          placeholder="Username"
                        />
                        <Textarea
                          value={profile?.bio || ''}
                          onChange={(e) => setProfile({...profile, bio: e.target.value})}
                          placeholder="Tell us about yourself..."
                          className="min-h-[80px]"
                        />
                        <Input
                          value={profile?.location || ''}
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                          placeholder="Location"
                        />
                        <Input
                          value={profile?.website || ''}
                          onChange={(e) => setProfile({...profile, website: e.target.value})}
                          placeholder="Website"
                        />
                        <div className="flex space-x-2">
                          <Button onClick={handleSaveProfile} size="sm" className="flex-1">
                            Save Changes
                          </Button>
                          <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="flex-1">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <h2 className="text-2xl font-bold">{profile?.displayName || profile?.username || 'Anonymous User'}</h2>
                          <p className="text-muted-foreground text-sm">@{profile?.username || 'user'}</p>
                        </div>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="secondary" className="flex items-center gap-1 mx-auto cursor-help">
                              <userStats.level.icon className="w-3 h-3" />
                              {userStats.level.level}
                              <Info className="w-3 h-3" />
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div className="space-y-2">
                              <p className="font-medium">{userStats.level.level}</p>
                              <p className="text-sm text-muted-foreground">{userStats.level.description}</p>
                              <div className="text-xs space-y-1">
                                <p><strong>Bronze:</strong> 0-500 CU earned</p>
                                <p><strong>Silver:</strong> 500-1000 CU earned</p>
                                <p><strong>Gold:</strong> 1000+ CU earned</p>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                        
                        {profile?.bio ? (
                          <p className="text-muted-foreground text-sm">{profile.bio}</p>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setIsEditing(true)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add a bio
                          </Button>
                        )}
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          {profile?.location && (
                            <p className="flex items-center justify-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {profile.location}
                            </p>
                          )}
                          {profile?.website && (
                            <p className="flex items-center justify-center gap-1">
                              <Globe className="w-3 h-3" />
                              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                                {profile.website}
                              </a>
                            </p>
                          )}
                          <p className="flex items-center justify-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Joined {userStats.joinDate}
                          </p>
                        </div>
                        
                        <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Profile Completion Card */}
              {profileCompletion < 100 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Target className="w-4 h-4" />
                      Profile Completion
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Complete your profile</span>
                        <span>{profileCompletion}%</span>
                      </div>
                      <Progress value={profileCompletion} className="h-2" />
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      {!profile?.bio && <p>• Add a bio to tell others about yourself</p>}
                      {!profile?.avatarUrl && <p>• Upload a profile picture</p>}
                      {!profile?.location && <p>• Add your location</p>}
                      {!profile?.website && <p>• Link your website</p>}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(true)}
                      className="w-full"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Complete Profile
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Stats Card with Hierarchy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Primary Stats */}
                  <div className="space-y-3">
                    <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                      <div className="text-3xl font-bold text-primary">{userStats.totalRewards}</div>
                      <div className="text-sm text-muted-foreground">CU Tokens Earned</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{userStats.posts}</div>
                      <div className="text-sm text-muted-foreground">Posts Created</div>
                    </div>
                  </div>
                  
                  {/* Secondary Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-xl font-semibold">{userStats.followers}</div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                    <div className="text-center p-3 bg-muted/20 rounded-lg">
                      <div className="text-xl font-semibold">{userStats.following}</div>
                      <div className="text-xs text-muted-foreground">Following</div>
                    </div>
                  </div>
                  
                  {/* Followers/Following Buttons */}
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Users className="w-4 h-4 mr-1" />
                          Followers
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Followers ({followers.length})</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {followers.length > 0 ? (
                            followers.map((follower, index) => (
                              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src="/placeholder.svg" />
                                    <AvatarFallback className="text-xs">
                                      {follower.username?.[0]?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium text-sm">{follower.username || 'Anonymous'}</span>
                                </div>
                                <Button size="sm" variant="outline">
                                  <UserMinus className="w-3 h-3" />
                                </Button>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-muted-foreground py-4">No followers yet</p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <UserPlus className="w-4 h-4 mr-1" />
                          Following
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Following ({following.length})</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {following.length > 0 ? (
                            following.map((followed, index) => (
                              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src="/placeholder.svg" />
                                    <AvatarFallback className="text-xs">
                                      {followed.username?.[0]?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium text-sm">{followed.username || 'Anonymous'}</span>
                                </div>
                                <Button size="sm" variant="outline">
                                  <UserMinus className="w-3 h-3" />
                                </Button>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-muted-foreground py-4">Not following anyone yet</p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                      achievement.unlocked ? 'bg-green-50 border border-green-200' : 'bg-muted/30'
                    }`}>
                      <div className={`p-2 rounded-full ${
                        achievement.unlocked ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
                      }`}>
                        <achievement.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${
                          achievement.unlocked ? 'text-green-800' : 'text-muted-foreground'
                        }`}>
                          {achievement.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        {achievement.progress !== undefined && achievement.maxProgress && (
                          <div className="mt-1">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress) * 100} 
                              className="h-1" 
                            />
                          </div>
                        )}
                      </div>
                      {achievement.unlocked && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Enhanced Token Balance & Send */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    CU Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Balance Display */}
                  <div className="text-center p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white">
                    <div className="text-3xl font-bold">{tokenBalance}</div>
                    <div className="text-sm opacity-90">CU Tokens Available</div>
                  </div>
                  
                  {/* Send Tokens Form with Better Validation */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Recipient Username</label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={sendTo}
                          onChange={(e) => setSendTo(e.target.value)}
                          placeholder="username"
                          className="pl-8"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Amount to Send</label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                          placeholder="0"
                          type="number"
                          min="1"
                          max={tokenBalance}
                          className="pl-8"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Min: 1 CU</span>
                        <span>Max: {tokenBalance} CU</span>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={sending || !sendTo || !sendAmount || parseInt(sendAmount) > tokenBalance || parseInt(sendAmount) < 1} 
                      className="w-full"
                      onClick={handleSendTokens}
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      {sending ? 'Sending...' : 'Send CU Tokens'}
                    </Button>
                  </div>
                  
                  {/* Transaction History Link */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setActiveTab('transactions')}
                  >
                    <History className="w-4 h-4 mr-2" />
                    View Transaction History
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Posts & Transactions */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="posts" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Posts ({userPosts.length})
                  </TabsTrigger>
                  <TabsTrigger value="transactions" className="flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Activity
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="posts" className="space-y-6">
                  {userPosts.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-12">
                          <div className="relative mb-6">
                            <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto" />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <Plus className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold mb-3">Ready to Share Your Story?</h3>
                          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Start your journey on ConnectUS by creating your first post. Share your thoughts, 
                            connect with others, and earn CU tokens for meaningful engagement.
                          </p>
                          <div className="space-y-3">
                            <Button className="flex items-center gap-2 mx-auto">
                              <PenTool className="w-4 h-4" />
                              Create Your First Post
                            </Button>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p>💡 <strong>Tip:</strong> Posts with engaging content earn more CU tokens</p>
                              <p>🌟 <strong>Pro tip:</strong> Use hashtags to reach more people</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-6">
                      {userPosts.map((post) => (
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
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="transactions" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Transaction History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {transactions.length > 0 ? (
                          transactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${
                                  tx.type === 'earned' ? 'bg-green-100 text-green-600' :
                                  tx.type === 'sent' ? 'bg-red-100 text-red-600' :
                                  'bg-blue-100 text-blue-600'
                                }`}>
                                  <Gift className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{tx.description}</p>
                                  <p className="text-xs text-muted-foreground">{formatTimestamp(tx.timestamp)}</p>
                                </div>
                              </div>
                              <div className={`font-bold ${
                                tx.type === 'earned' ? 'text-green-600' :
                                tx.type === 'sent' ? 'text-red-600' :
                                'text-blue-600'
                              }`}>
                                {tx.type === 'sent' ? '-' : '+'}{tx.amount} CU
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No transactions yet</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="activity" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <div className="p-2 rounded-full bg-green-100 text-green-600">
                            <Heart className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Your post received 5 likes</p>
                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                            <MessageCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">New comment on your post</p>
                            <p className="text-xs text-muted-foreground">1 day ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                            <Share2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Your post was shared 3 times</p>
                            <p className="text-xs text-muted-foreground">3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Profile;