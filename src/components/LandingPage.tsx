import { useState, useEffect, useRef } from 'react';
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
  BarChart3,
  MessageCircle as ChatIcon,
  X as CloseIcon,
  Send as SendIcon
} from 'lucide-react';

import heroBackground from '@/assets/hero-bg.jpg';

// Add Unsplash hero image
const HERO_IMAGE = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';

// Add undraw SVGs for steps
const HOW_IT_WORKS_IMAGES = [
  'https://undraw.co/api/illustrations/7e1c7e1c-7e1c-4e1c-8e1c-7e1c7e1c7e1c', // Identity
  'https://undraw.co/api/illustrations/8e2c8e2c-8e2c-4e2c-9e2c-8e2c8e2c8e2c', // Share
  'https://undraw.co/api/illustrations/9e3c9e3c-9e3c-4e3c-ae3c-9e3c9e3c9e3c', // Earn
];

// Avatars for social proof
const AVATARS = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/65.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/12.jpg',
  'https://randomuser.me/api/portraits/women/21.jpg',
  'https://randomuser.me/api/portraits/men/23.jpg',
  'https://randomuser.me/api/portraits/women/29.jpg',
  'https://randomuser.me/api/portraits/men/41.jpg',
  'https://randomuser.me/api/portraits/women/50.jpg',
];

// Add avatars for testimonials
const TESTIMONIAL_AVATARS = [
  'https://randomuser.me/api/portraits/women/65.jpg',
  'https://randomuser.me/api/portraits/men/34.jpg',
  'https://randomuser.me/api/portraits/women/32.jpg',
  'https://randomuser.me/api/portraits/men/45.jpg',
  'https://randomuser.me/api/portraits/women/21.jpg',
  'https://randomuser.me/api/portraits/men/23.jpg',
];

// Team avatars
const TEAM_AVATARS = [
  'https://randomuser.me/api/portraits/men/11.jpg', // Aryan Gupta
  'https://randomuser.me/api/portraits/men/12.jpg', // Arnav Jhalani
];

interface WalletConnectionProps {
  onConnect: () => void;
}

// Animated counter hook
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = typeof target === 'string' ? parseInt(target.replace(/[^0-9]/g, '')) : target;
    if (isNaN(end)) return;
    const step = Math.ceil(end / (duration / 16));
    let raf;
    function update() {
      start += step;
      if (start >= end) {
        setCount(end);
        return;
      }
      setCount(start);
      raf = requestAnimationFrame(update);
    }
    update();
    return () => raf && cancelAnimationFrame(raf);
  }, [target, duration]);
  return count;
}

// Add Unsplash images for content types
const CONTENT_TYPE_IMAGES = [
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', // Art & Design
  'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80', // Education
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80', // Tech & Business
  'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80', // Lifestyle
  'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80', // Health & Fitness
  'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80', // Travel
];

// Fun mascot/celebration SVG for CTA
const CTA_IMAGE = 'https://undraw.co/api/illustrations/celebration';

export const LandingPage = ({ onConnect }: WalletConnectionProps) => {
  const { login, isAuthenticated } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { from: 'bot', text: 'Hi! 👋 How can we help you?' }
  ]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Animate hero section on mount
  useEffect(() => {
    document.body.classList.add('overflow-x-hidden');
    return () => document.body.classList.remove('overflow-x-hidden');
  }, []);

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

  // Chat bot logic
  const standardAnswers: Record<string, string> = {
    'what is connectus': 'ConnectUS is a decentralized social platform where you own your content, earn CU tokens, and connect with a global community. All posts are permanent and censorship-resistant!',
    'how do i earn cu tokens': 'You earn CU tokens by creating quality posts, engaging with others, and receiving likes from the community. The more value you add, the more you earn!',
    'is my content really permanent': 'Yes! All your posts are stored immutably on the blockchain. No one can delete or alter your content—not even us.',
    'how do i get started': "Just connect your Internet Identity and start posting! You'll earn tokens and build your profile from day one.",
    'gm': 'gm fren! ☀️ Wishing you a productive day on ConnectUS!',
    'hello': 'Hello! 👋 How can I assist you today?'
  };
  const quickReplies = [
    'What is ConnectUS?',
    'How do I earn CU tokens?',
    'Is my content really permanent?',
    'How do I get started?'
  ];
  const handleSend = (msg?: string) => {
    const userMsg = (msg || chatInput).trim();
    if (!userMsg) return;
    setChatHistory(h => [...h, { from: 'user', text: userMsg }]);
    setChatInput('');
    setIsBotTyping(true);
    setTimeout(() => {
      const key = userMsg.toLowerCase().replace(/[^a-z0-9 ]/g, '');
      const answer = standardAnswers[key] || "I'm not sure yet, but our team will get back to you soon!";
      setChatHistory(h => [...h, { from: 'bot', text: answer }]);
      setIsBotTyping(false);
    }, 1200);
  };
  useEffect(() => {
    if (showChat && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, showChat, isBotTyping]);

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

  // Typewriter effect for headline
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'The Social Platform That Pays You Back';
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Simple carousel state for testimonials
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const visibleTestimonials = testimonials.slice(testimonialIndex, testimonialIndex + 3);
  function nextTestimonial() {
    setTestimonialIndex(i => (i + 1) % (testimonials.length - 2));
  }
  function prevTestimonial() {
    setTestimonialIndex(i => (i - 1 + testimonials.length - 2) % (testimonials.length - 2));
  }

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {/* Animated background gradient with particles */}
      <div className="fixed inset-0 z-0 pointer-events-none animate-gradient-x bg-gradient-to-tr from-purple-900 via-black to-indigo-900 opacity-80 blur-2xl" />
      {/* Hero Image Overlay */}
      <img src={HERO_IMAGE} alt="Community" className="fixed inset-0 w-full h-full object-cover object-center opacity-30 z-0 pointer-events-none" style={{mixBlendMode:'lighten'}} />
      {/* White Glow Background - now above the gradient */}
      <div className="fixed inset-0 z-10 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <div className="w-[140vw] h-[140vh] bg-white opacity-40 blur-4xl rounded-full mx-auto my-auto" style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.3) 60%, transparent 100%)',
            filter: 'blur(120px)'
          }} />
        </div>
      </div>
      <Header showNav={false} showSearch={false} showQuickPost={false} showNotifications={false} showUserMenu={false} showLogo={true} />
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <div className="relative flex flex-col items-center z-20">
          {/* CU Logo - glassmorphism effect */}
          <div className="w-28 h-28 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl flex items-center justify-center shadow-2xl mb-8" style={{boxShadow:'0 0 60px 10px #fff4, 0 0 120px 40px #a78bfa44'}}>
            <span className="text-white text-5xl font-extrabold tracking-widest drop-shadow-glow" style={{textShadow:'0 0 32px #fff, 0 0 64px #a78bfa'}}>
              CU
            </span>
          </div>
          <div className="text-center space-y-8 max-w-6xl mx-auto py-16 animate-fade-in-stagger">
            {/* Animated Headline */}
            <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight max-w-4xl mx-auto drop-shadow-glow">
              <span className="text-primary">{displayedText}</span>
              <span className="blinking-cursor text-primary">|</span>
            </h2>
            <style>{`.blinking-cursor { animation: blink 1s steps(2, start) infinite; } @keyframes blink { to { opacity: 0; } }`}</style>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Share your world, earn CU tokens for quality content, and own your digital identity forever. 
              Join 2,847+ creators already earning real rewards while building their permanent online presence.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-white/60">
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
            {/* Glowing CTA Button */}
            <Card className="max-w-lg mx-auto border-none bg-neutral-900/90 backdrop-blur-lg shadow-2xl rounded-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2 font-bold text-white">Start Earning Today</CardTitle>
                <p className="text-white/70">
                  Create your account and earn your first CU tokens in minutes
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full h-14 text-lg bg-gradient-to-tr from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold shadow-lg rounded-xl border-2 border-white/30 focus:ring-4 focus:ring-primary/40 focus:outline-none"
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
                <p className="text-xs text-white/60 text-center">
                  Free to join • Start earning immediately • No personal data required
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* SVG Wave Accent */}
        <svg className="absolute top-0 left-0 w-full h-32 z-0" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{pointerEvents:'none'}}>
          <path fill="#a78bfa22" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,154.7C840,149,960,171,1080,186.7C1200,203,1320,213,1380,218.7L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
        </svg>
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 z-0 bg-black/60 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-glow">
              Why Creators Choose ConnectUS
            </h3>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Join thousands of creators who've found a better way to share and earn
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, i) => (
              <Card key={i} className="text-center border-none bg-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl transform hover:scale-105 group relative overflow-hidden">
                {/* Icon with colorful glassy background */}
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-glow border-2 border-white/20 bg-gradient-to-tr from-white/30 to-${feature.color.replace('text-', '')}/40 group-hover:scale-110 transition-transform duration-300`} style={{boxShadow:'0 0 32px #fff6, 0 0 64px #a78bfa33'}}>
                  <feature.icon className={`w-10 h-10 ${feature.color} drop-shadow-glow`} />
                </div>
                <CardContent className="p-8">
                  <h4 className="text-xl font-bold text-white mb-2 drop-shadow-glow">{feature.title}</h4>
                  <p className="text-white/70">{feature.description}</p>
                </CardContent>
                {/* Glass shine effect */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-3xl blur-2xl" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 px-4 bg-black/90 overflow-hidden">
        {/* Background Accent */}
        <svg className="absolute -top-16 right-0 w-1/2 h-64 z-0" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{pointerEvents:'none'}}>
          <ellipse cx="300" cy="100" rx="300" ry="100" fill="#6366f133" />
        </svg>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-glow">
              Start Earning in 3 Simple Steps
            </h3>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Join thousands of creators already earning CU tokens and building their digital legacy
            </p>
          </div>
          {/* Timeline/Stepper */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8">
            {howItWorksSteps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center z-10">
                {/* Step Icon Only (no illustration) */}
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full ${step.color} flex items-center justify-center shadow-glow border-2 border-white/20 bg-gradient-to-tr from-white/30 to-white/10`}>
                  <step.icon className="w-12 h-12 text-white" />
                </div>
                <Badge variant="outline" className="mb-2 text-sm font-bold text-white border-white/40 bg-black/60">
                  Step {step.step}
                </Badge>
                <h4 className="text-2xl font-bold text-white mb-2 drop-shadow-glow">{step.title}</h4>
                <p className="text-white/70 leading-relaxed mb-2">{step.description}</p>
                {/* Animated Arrow */}
                {i < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-[-48px] transform -translate-y-1/2 z-10 animate-float">
                    <ArrowRight className="w-10 h-10 text-primary/60" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Stats & Social Proof */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-glow">
              ConnectUS Growth Metrics
            </h3>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Real-time statistics showing our platform's rapid growth and creator success
            </p>
          </div>
          {/* Wall of Avatars */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {AVATARS.map((src, i) => (
              <img key={i} src={src} alt="User avatar" className="w-12 h-12 rounded-full border-2 border-white/30 shadow-md object-cover hover:scale-110 transition-transform duration-200" loading="lazy" />
            ))}
            <span className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold border-2 border-white/30 shadow-md text-xs">+2,800</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformStats.map((stat, i) => {
              // Animated counter for numbers
              const value = useCountUp(stat.value.replace(/[^0-9]/g, ''), 1200 + i * 300);
              const display = stat.value.includes('%') ? value + '%' : stat.value.includes('$') ? '$' + value : value;
              return (
                <Card key={i} className="text-center border-none bg-neutral-900/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/30 flex items-center justify-center shadow-glow">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold mb-2">
                      {display}
                    </div>
                    <div className="text-sm opacity-90 mb-2">{stat.label}</div>
                    <div className="text-xs opacity-75 mb-2">{stat.description}</div>
                    <div className={`flex items-center justify-center text-xs ${stat.trendUp ? 'text-green-400' : 'text-red-400'}`}> 
                      {stat.trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {stat.trend}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content Types Section */}
      <section className="relative py-24 px-4 bg-black/90 overflow-hidden">
        {/* Gradient Accent */}
        <svg className="absolute -bottom-16 left-0 w-1/2 h-64 z-0" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{pointerEvents:'none'}}>
          <ellipse cx="300" cy="100" rx="300" ry="100" fill="#a78bfa33" />
        </svg>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-glow">
              What Our Creators Share
            </h3>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Discover the diverse content types that are thriving on ConnectUS
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {contentTypes.map((content, i) => (
              <Card key={i} className={`border-none bg-gradient-to-tr ${content.color} relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl transform hover:scale-105 group`}>
                {/* Background image */}
                <img src={CONTENT_TYPE_IMAGES[i]} alt={content.type} className="absolute inset-0 w-full h-full object-cover object-center opacity-20 group-hover:opacity-30 transition duration-300 z-0" loading="lazy" />
                <CardContent className="relative p-8 z-10 flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-full bg-black/40 flex items-center justify-center mb-4 shadow-glow border-2 border-white/20`}>
                    <content.icon className="w-7 h-7 text-white drop-shadow-glow" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 drop-shadow-glow">{content.type}</h4>
                  <p className="text-sm text-white/80">{content.count}</p>
                </CardContent>
                {/* Glass shine effect */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-3xl blur-2xl pointer-events-none" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-24 px-4 bg-gradient-to-tr from-primary/80 to-secondary/80 overflow-hidden">
        {/* Glassy Accent */}
        <svg className="absolute -top-16 left-0 w-1/2 h-64 z-0" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{pointerEvents:'none'}}>
          <ellipse cx="300" cy="100" rx="300" ry="100" fill="#fff3" />
        </svg>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-glow">
              Real Creators, Real Earnings
            </h3>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Meet the creators who are already earning significant rewards on ConnectUS
            </p>
          </div>
          {/* Carousel Controls */}
          <div className="flex justify-end gap-2 mb-4">
            <button onClick={prevTestimonial} className="bg-white/20 hover:bg-white/40 text-primary rounded-full w-10 h-10 flex items-center justify-center shadow-md transition"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            <button onClick={nextTestimonial} className="bg-white/20 hover:bg-white/40 text-primary rounded-full w-10 h-10 flex items-center justify-center shadow-md transition"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleTestimonials.map((testimonial, i) => (
              <Card key={i} className="border-none bg-white/10 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl relative overflow-hidden group">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <img src={TESTIMONIAL_AVATARS[(testimonialIndex + i) % TESTIMONIAL_AVATARS.length]} alt={testimonial.name} className="w-14 h-14 rounded-full border-2 border-white/30 shadow-md object-cover mr-4" loading="lazy" />
                    <div className="flex-1">
                      <div className="font-bold text-white text-lg">{testimonial.name}</div>
                      <div className="text-sm text-white/70">{testimonial.role}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {testimonial.badge}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-green-400">
                          {testimonial.earnings}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {/* Star Ratings */}
                  <div className="flex items-center mb-2">
                    {[...Array(testimonial.rating)].map((_, idx) => (
                      <svg key={idx} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.04 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                    ))}
                  </div>
                  <div className="text-sm text-white/80 mb-2 flex-1">{testimonial.content}</div>
                  <div className="flex items-center gap-2 text-xs text-white/70 mt-2">
                    <testimonial.icon className="w-4 h-4" />
                    <span>{testimonial.contentType}</span>
                  </div>
                </CardContent>
                {/* Glass shine effect */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-3xl blur-2xl pointer-events-none" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 px-4 bg-gradient-to-tr from-indigo-900 via-purple-900 to-black overflow-hidden">
        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <div className="mb-12">
            <Crown className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h3 className="text-3xl font-bold mb-4 drop-shadow-glow">
              Ready to Start Earning?
            </h3>
            <p className="text-xl opacity-90 max-w-2xl mx-auto text-white/70">
              Join 2,847+ creators already earning CU tokens. Create your account now and start building your permanent online presence while getting paid for quality content.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-md shadow-xl">
              <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h4 className="font-bold mb-2 text-white">Start Earning Immediately</h4>
              <p className="text-sm opacity-75 text-white/70">Earn your first CU tokens within minutes of joining</p>
            </div>
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-md shadow-xl">
              <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h4 className="font-bold mb-2 text-white">Own Your Content Forever</h4>
              <p className="text-sm opacity-75 text-white/70">Your posts are permanently stored on the blockchain</p>
            </div>
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-md shadow-xl">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h4 className="font-bold mb-2 text-white">Join Growing Community</h4>
              <p className="text-sm opacity-75 text-white/70">Connect with creators who share your values</p>
            </div>
          </div>
          <Button 
            className="h-16 px-12 text-2xl bg-gradient-to-tr from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 font-bold shadow-2xl rounded-2xl border-2 border-white/30 focus:ring-4 focus:ring-primary/40 focus:outline-none mb-4 mt-2"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Creating Your Account...
              </>
            ) : (
              <>
                <Gift className="mr-2 h-6 w-6" />
                Create Account & Start Earning
              </>
            )}
          </Button>
          <p className="text-sm opacity-75 mt-4 text-white/70">
            Free to join • No personal data required • Start earning immediately
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative mt-32 mb-16 py-16 px-4 bg-gradient-to-tr from-black via-neutral-900 to-black overflow-hidden">
        {/* Gradient Accent */}
        <svg className="absolute -top-16 right-0 w-1/2 h-64 z-0" viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{pointerEvents:'none'}}>
          <ellipse cx="300" cy="100" rx="300" ry="100" fill="#a78bfa22" />
        </svg>
        <div className="max-w-3xl mx-auto relative z-10">
          <Card className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl border-none">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white text-center drop-shadow-glow mb-2 animate-fade-in-stagger">Meet the Team</CardTitle>
              <p className="text-center text-white/70 mb-4 animate-fade-in-stagger">The builders behind ConnectUS</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                {/* Aryan Gupta */}
                <div className="flex flex-col items-center bg-white/10 rounded-2xl p-6 shadow-lg w-full md:w-1/2 animate-fade-in-stagger">
                  <div className="font-semibold text-lg text-white">Aryan Gupta</div>
                  <span className="inline-block bg-gradient-to-tr from-primary to-secondary text-white text-xs font-bold px-3 py-1 rounded-full mt-1 mb-2">Team Lead</span>
                  <div className="text-sm text-white/70 mb-2">Fullstack & Smart Contract Engineer</div>
                  <div className="text-xs text-white/60 text-center">- Platform architecture<br/>- Motoko backend<br/>- Token rewards<br/>- UI/UX direction</div>
                </div>
                {/* Arnav Jhalani */}
                <div className="flex flex-col items-center bg-white/10 rounded-2xl p-6 shadow-lg w-full md:w-1/2 animate-fade-in-stagger">
                  <div className="font-semibold text-lg text-white">Arnav Jhalani</div>
                  <span className="inline-block bg-gradient-to-tr from-secondary to-primary text-white text-xs font-bold px-3 py-1 rounded-full mt-1 mb-2">Frontend Dev</span>
                  <div className="text-sm text-white/70 mb-2">Frontend Developer</div>
                  <div className="text-xs text-white/60 text-center">- React UI<br/>- Page layouts<br/>- Component design<br/>- Accessibility</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Floating Chat Box - clean, no border */}
      <div className="fixed bottom-8 right-8 z-[9999]">
        {!showChat ? (
          <button
            className="bg-gradient-to-tr from-primary to-secondary p-4 rounded-full shadow-xl hover:scale-110 transition-transform focus:outline-none"
            onClick={() => setShowChat(true)}
            aria-label="Open chat"
          >
            <ChatIcon className="w-7 h-7 text-white" />
          </button>
        ) : (
          <div className="w-80 bg-neutral-900 border border-primary rounded-2xl shadow-2xl flex flex-col animate-fade-in-up">
            <div className="flex items-center justify-between px-4 py-3 border-b border-primary/30 bg-gradient-to-tr from-primary/30 to-secondary/20 rounded-t-2xl">
              <span className="font-bold text-white text-lg flex items-center gap-2">
                <span className="inline-block w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold">CU</span>
                ConnectUS Chat
              </span>
              <button onClick={() => setShowChat(false)} className="text-white hover:text-primary focus:outline-none">
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-80">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-lg px-4 py-2 max-w-[80%] text-sm shadow ${msg.from === 'user' ? 'bg-primary text-white' : 'bg-neutral-800 text-white/90'} animate-fade-in-up`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isBotTyping && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-4 py-2 max-w-[80%] bg-neutral-800 text-white/90 flex items-center gap-2 animate-fade-in-up">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150" />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300" />
                    <span className="ml-2 text-xs">Typing…</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="px-4 pb-3">
              <div className="flex gap-2 mb-2 flex-wrap">
                {quickReplies.map(q => (
                  <button key={q} className="bg-primary/20 text-white/80 rounded-full px-3 py-1 text-xs hover:bg-primary/40 transition" onClick={() => handleSend(q)}>{q}</button>
                ))}
              </div>
              <form className="flex gap-2" onSubmit={e => { e.preventDefault(); handleSend(); }}>
                <input
                  className="flex-1 rounded-lg bg-neutral-800 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Type your question…"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  disabled={isBotTyping}
                />
                <Button type="submit" size="icon" className="bg-primary text-white hover:bg-primary/80" disabled={!chatInput.trim() || isBotTyping}>
                  <SendIcon className="w-4 h-4" />
                </Button>
              </form>
            </div>
            <div className="px-4 py-2 border-t border-primary/30 bg-neutral-900 rounded-b-2xl text-xs text-white/60 text-center">
              Powered by ConnectUS FAQ
            </div>
          </div>
        )}
      </div>
    </div>
  );
};