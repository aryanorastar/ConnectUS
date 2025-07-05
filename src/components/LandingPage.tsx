import { useState } from 'react';
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
  Gift
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
      title: "Decentralized Network",
      description: "Your content lives permanently on the Internet Computer blockchain",
      icon: Globe,
      color: "text-blue-600"
    },
    {
      title: "Earn CU Rewards", 
      description: "Earn tokens for quality content and community engagement",
      icon: Coins,
      color: "text-yellow-600"
    },
    {
      title: "Own Your Data",
      description: "Complete control over your digital identity and content",
      icon: Shield,
      color: "text-green-600"
    },
    {
      title: "No Censorship",
      description: "Express yourself freely without central control",
      icon: Users,
      color: "text-purple-600"
    }
  ];

  const howItWorksSteps = [
    {
      step: "1",
      title: "Create Your Identity",
      description: "Connect with Internet Identity to create your secure, decentralized profile. No personal data required - just your digital identity.",
      icon: Key,
      color: "bg-blue-500"
    },
    {
      step: "2", 
      title: "Share Your Content",
      description: "Post thoughts, images, and videos directly to the blockchain. Your content is permanent and censorship-resistant.",
      icon: Upload,
      color: "bg-purple-500"
    },
    {
      step: "3",
      title: "Earn CU Rewards", 
      description: "Get rewarded with CU tokens for quality posts, engagement, and community contributions. Build your reputation.",
      icon: Coins,
      color: "bg-yellow-500"
    }
  ];

  const platformStats = [
    { label: "Posts Created", value: "1,247", icon: MessageCircle },
    { label: "CU Tokens Distributed", value: "45,892", icon: Coins },
    { label: "Active Users", value: "892", icon: Users },
    { label: "Total Engagement", value: "12,456", icon: Heart }
  ];

  const testimonials = [
    {
      name: "Alice Developer",
      role: "Web3 Enthusiast",
      content: "Finally, a social platform that puts users first. The CU rewards system is brilliant!",
      avatar: "AD",
      rating: 5
    },
    {
      name: "Bob Designer", 
      role: "Creative Professional",
      content: "Love the decentralized approach. My content is truly mine and can't be taken down.",
      avatar: "BD",
      rating: 5
    },
    {
      name: "Carol Crypto",
      role: "Blockchain Developer", 
      content: "The Internet Computer integration is seamless. This is the future of social media.",
      avatar: "CC",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400/20 via-purple-300/20 to-pink-200/20"></div>
        <div className="relative text-center space-y-8 max-w-6xl mx-auto z-10 py-16">
          {/* ConnectUS Logo & Brand */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-400 rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-4xl">CU</span>
            </div>
            <div className="text-left">
              <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-indigo-700 to-purple-500">
                ConnectUS
              </h1>
              <p className="text-xl text-muted-foreground font-medium mt-2">
                Decentralized • Secure • Yours
              </p>
            </div>
          </div>

          <h2 className="text-5xl font-bold text-foreground leading-tight max-w-4xl mx-auto">
            The Future of Social Media is
            <span className="text-primary"> Decentralized</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Built on Internet Computer Protocol, where your content is permanent, 
            your data is yours, and quality contributions are rewarded with CU tokens.
          </p>

          {/* CTA Button */}
          <Card className="max-w-lg mx-auto border-none bg-white/80 backdrop-blur-lg shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2 font-bold">Join ConnectUS Today</CardTitle>
              <p className="text-muted-foreground">
                Start your decentralized social journey
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
                    Connecting...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Connect with Internet Identity
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Secure authentication with Internet Identity
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
              Why Choose ConnectUS?
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the next generation of social media with blockchain-powered features
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
              How ConnectUS Works
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps and start earning CU tokens
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
              ConnectUS in Action
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See the impact of our decentralized social network
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformStats.map((stat, i) => (
              <Card key={i} className="text-center border-none bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-foreground mb-4">
              What Our Users Say
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users already experiencing the future of social media
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="border-none bg-white/80 backdrop-blur-md shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{testimonial.content}</p>
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Built by Team4 Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Crown className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Built by Team4
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A passionate team dedicated to building the future of decentralized social media
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-white/60 rounded-xl shadow-md">
              <Zap className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
              <h4 className="font-bold text-foreground mb-2">Innovation</h4>
              <p className="text-sm text-muted-foreground">Pushing the boundaries of Web3 technology</p>
            </div>
            <div className="p-6 bg-white/60 rounded-xl shadow-md">
              <Shield className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
              <h4 className="font-bold text-foreground mb-2">Security</h4>
              <p className="text-sm text-muted-foreground">Built with privacy and security first</p>
            </div>
            <div className="p-6 bg-white/60 rounded-xl shadow-md">
              <Users className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
              <h4 className="font-bold text-foreground mb-2">Community</h4>
              <p className="text-sm text-muted-foreground">Empowering users through decentralization</p>
            </div>
          </div>
          
          <Button 
            className="h-12 text-lg bg-gradient-to-tr from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold shadow-lg rounded-xl"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Gift className="mr-2 h-5 w-5" />
                Start Your Journey
              </>
            )}
          </Button>
        </div>
      </section>
    </div>
  );
};