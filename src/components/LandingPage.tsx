import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Loader2, 
  Key, 
  Upload, 
  Coins, 
  Users, 
  Shield, 
  Globe, 
  Sparkles,
  MessageCircle,
  Heart,
  Share2,
  TrendingUp,
  Award,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Crown,
  Gift,
  Lock,
  Infinity,
  Rocket,
  Target,
  DollarSign,
  Calendar,
  Clock,
  TrendingDown,
  UserCheck,
  MessageSquare,
  Image,
  Video,
  FileText,
  Play,
  Camera,
  PenTool,
  Palette,
  Code,
  BookOpen,
  Lightbulb,
  Smile,
  ThumbsUp,
  Eye,
  BarChart3
} from 'lucide-react';

import heroBackground from '@/assets/hero-bg.jpg';

interface WalletConnectionProps {
  onConnect: () => void;
}

export const LandingPage = ({ onConnect }: WalletConnectionProps) => {
  const { login, isAuthenticated } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await login();
      onConnect();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const features = [
    {
      title: "Own Your Content Forever",
      description: "Your posts, photos, and videos are stored permanently on the blockchain. No more losing your memories when platforms shut down.",
      icon: Shield,
      color: "text-green-600"
    },
    {
      title: "Earn Real Rewards", 
      description: "Get paid in CU tokens for creating quality content and helping others. Turn your creativity into actual value.",
      icon: Coins,
      color: "text-yellow-600"
    },
    {
      title: "No More Censorship",
      description: "Express yourself freely without worrying about arbitrary content removal. Your voice stays online forever.",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Complete Privacy",
      description: "Your data belongs to you. No algorithms tracking your every move or selling your information to advertisers.",
      icon: Lock,
      color: "text-blue-600"
    }
  ];

  const howItWorksSteps = [
    {
      step: "1",
      title: "Create Your Identity",
      description: "Sign in securely with Internet Identity - no personal info needed, just your digital identity that you control.",
      icon: Key,
      color: "bg-blue-500"
    },
    {
      step: "2", 
      title: "Share Your Story",
      description: "Post your thoughts, photos, and videos directly to the blockchain. Your content becomes permanent and searchable.",
      icon: Upload,
      color: "bg-purple-500"
    },
    {
      step: "3",
      title: "Earn While You Share", 
      description: "Get rewarded with CU tokens for quality posts and meaningful interactions. Your reputation grows with every contribution.",
      icon: Coins,
      color: "bg-yellow-500"
    }
  ];

  const platformStats = [
    { 
      label: "Active Users", 
      value: "2,847", 
      icon: Users, 
      description: "Growing 23% this month",
      trend: "+23%",
      trendUp: true
    },
    { 
      label: "CU Tokens Earned", 
      value: "$12,456", 
      icon: DollarSign, 
      description: "Total value distributed",
      trend: "+156%",
      trendUp: true
    },
    { 
      label: "Posts Created", 
      value: "15,892", 
      icon: MessageCircle, 
      description: "Quality content shared",
      trend: "+89%",
      trendUp: true
    },
    { 
      label: "Engagement Rate", 
      value: "94%", 
      icon: Heart, 
      description: "Higher than traditional platforms",
      trend: "+12%",
      trendUp: true
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Digital Artist",
      content: "I've earned over 500 CU tokens sharing my artwork! Finally, a platform that actually values creators. My art is permanently stored and I get paid for quality content.",
      avatar: "SC",
      rating: 5,
      badge: "Gold Creator",
      earnings: "500+ CU",
      contentType: "Art & Design",
      icon: Palette
    },
    {
      name: "Marcus Rodriguez", 
      role: "Tech Educator",
      content: "Teaching coding on ConnectUS has been incredible. I earn tokens while helping others learn, and my tutorials are permanently accessible. This is the future of education.",
      avatar: "MR",
      rating: 5,
      badge: "Silver Creator",
      earnings: "1,200+ CU",
      contentType: "Education",
      icon: Code
    },
    {
      name: "Emma Thompson",
      role: "Travel Blogger",
      content: "My travel stories are now permanently preserved on the blockchain. I earn CU tokens for sharing authentic experiences, and my content can't be deleted by algorithms.",
      avatar: "ET",
      rating: 5,
      badge: "Bronze Creator",
      earnings: "750+ CU",
      contentType: "Travel & Lifestyle",
      icon: Globe
    },
    {
      name: "David Kim",
      role: "Startup Founder",
      content: "ConnectUS helped me build a community around my startup. The token rewards incentivize quality discussions, and I own all my content. Game-changing platform.",
      avatar: "DK",
      rating: 5,
      badge: "Gold Creator",
      earnings: "2,100+ CU",
      contentType: "Business & Tech",
      icon: TrendingUp
    },
    {
      name: "Lisa Park",
      role: "Fitness Coach",
      content: "I share workout tips and earn CU tokens for helping people get healthy. My content is permanently available, and I'm building a sustainable income doing what I love.",
      avatar: "LP",
      rating: 5,
      badge: "Silver Creator",
      earnings: "890+ CU",
      contentType: "Health & Fitness",
      icon: Target
    },
    {
      name: "Alex Johnson",
      role: "Photographer",
      content: "My photography portfolio is now permanently stored on the blockchain. I earn rewards for quality work, and my images can't be removed or censored. Perfect for artists.",
      avatar: "AJ",
      rating: 5,
      badge: "Bronze Creator",
      earnings: "650+ CU",
      contentType: "Photography",
      icon: Camera
    }
  ];

  const contentTypes = [
    { type: "Art & Design", icon: Palette, count: "2,847 posts", color: "from-purple-500 to-pink-500" },
    { type: "Education", icon: BookOpen, count: "1,923 posts", color: "from-blue-500 to-cyan-500" },
    { type: "Tech & Business", icon: Code, count: "3,456 posts", color: "from-green-500 to-emerald-500" },
    { type: "Lifestyle", icon: Smile, count: "4,123 posts", color: "from-yellow-500 to-orange-500" },
    { type: "Health & Fitness", icon: Target, count: "1,567 posts", color: "from-red-500 to-pink-500" },
    { type: "Travel", icon: Globe, count: "2,134 posts", color: "from-indigo-500 to-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-purple-50 to-pink-50">
      <Header showNav={false} showSearch={false} showQuickPost={false} showNotifications={false} showUserMenu={false} showLogo={true} />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400/20 via-purple-300/20 to-pink-200/20"></div>
        <div className="relative text-center space-y-8 max-w-6xl mx-auto z-10 py-16">
          <h2 className="text-5xl font-bold text-foreground leading-tight max-w-4xl mx-auto">
            The Social Platform That
            <span className="text-primary"> Pays You Back</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Share your world, earn CU tokens for quality content, and own your digital identity forever. 
            Join 2,847+ creators already earning real rewards while building their permanent online presence.
          </p>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>2,847+ active creators</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>$12,456+ in rewards distributed</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>100% censorship-resistant</span>
            </div>
          </div>

          {/* CTA Button */}
          <Card className="max-w-lg mx-auto border-none bg-white/80 backdrop-blur-lg shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2 font-bold">Start Earning Today</CardTitle>
              <p className="text-muted-foreground">
                Create your account and earn your first CU tokens in minutes
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full h-12 text-lg bg-gradient-to-tr from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold shadow-lg rounded-xl"
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Your Account...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Create Account & Start Earning
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Free to join • Start earning immediately • No personal data required
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-foreground mb-4">
              Why Creators Choose ConnectUS
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of creators who've found a better way to share and earn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <Card key={i} className="text-center border-none bg-white/60 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-foreground mb-4">
              Start Earning in 3 Simple Steps
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of creators already earning CU tokens and building their digital legacy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, i) => (
              <div key={i} className="relative">
                <Card className="text-center border-none bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${step.color} flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <Badge variant="outline" className="mb-4 text-sm font-bold">
                      Step {step.step}
                    </Badge>
                    <h4 className="text-2xl font-bold text-foreground mb-4">{step.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
                
                {/* Arrow between steps */}
                {i < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-foreground mb-4">
              ConnectUS Growth Metrics
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real-time statistics showing our platform's rapid growth and creator success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformStats.map((stat, i) => (
              <Card key={i} className="text-center border-none bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm opacity-90 mb-2">{stat.label}</div>
                  <div className="text-xs opacity-75 mb-2">{stat.description}</div>
                  <div className={`flex items-center justify-center text-xs ${stat.trendUp ? 'text-green-200' : 'text-red-200'}`}>
                    {stat.trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {stat.trend}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Content Types Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-foreground mb-4">
              What Our Creators Share
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the diverse content types that are thriving on ConnectUS
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentTypes.map((content, i) => (
              <Card key={i} className="border-none bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${content.color} flex items-center justify-center mb-4`}>
                    <content.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground mb-2">{content.type}</h4>
                  <p className="text-sm text-muted-foreground">{content.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-foreground mb-4">
              Real Creators, Real Earnings
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Meet the creators who are already earning significant rewards on ConnectUS
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="border-none bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {testimonial.badge}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-green-600">
                          {testimonial.earnings}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <testimonial.icon className="w-4 h-4 text-muted-foreground mr-2" />
                    <span className="text-xs text-muted-foreground">{testimonial.contentType}</span>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">{testimonial.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="text-sm font-bold text-green-600">
                      {testimonial.earnings}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-tr from-indigo-500 to-purple-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="mb-8">
            <Crown className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-4">
              Ready to Start Earning?
            </h3>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join 2,847+ creators already earning CU tokens. Create your account now and start building your permanent online presence while getting paid for quality content.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-md">
              <Zap className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-bold mb-2">Start Earning Immediately</h4>
              <p className="text-sm opacity-75">Earn your first CU tokens within minutes of joining</p>
            </div>
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-md">
              <Shield className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-bold mb-2">Own Your Content Forever</h4>
              <p className="text-sm opacity-75">Your posts are permanently stored on the blockchain</p>
            </div>
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-md">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-bold mb-2">Join Growing Community</h4>
              <p className="text-sm opacity-75">Connect with creators who share your values</p>
            </div>
          </div>
          
          <Button 
            className="h-12 text-lg bg-white text-indigo-600 hover:bg-gray-100 font-bold shadow-lg rounded-xl"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Your Account...
              </>
            ) : (
              <>
                <Gift className="mr-2 h-5 w-5" />
                Create Account & Start Earning
              </>
            )}
          </Button>
          
          <p className="text-sm opacity-75 mt-4">
            Free to join • No personal data required • Start earning immediately
          </p>
        </div>
      </section>
    </div>
  );
};