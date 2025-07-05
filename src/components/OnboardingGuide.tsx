import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Gift, 
  Users, 
  TrendingUp, 
  MessageCircle, 
  Heart, 
  Share2,
  Zap,
  Target,
  Award,
  BookOpen,
  Play,
  CheckCircle,
  ArrowRight,
  X,
  Star,
  Coins,
  Shield,
  Globe,
  Lock,
  UserCheck,
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  TrendingDown,
  Eye,
  ThumbsUp,
  Hash,
  Bookmark,
  Settings,
  HelpCircle,
  Info,
  Search,
  Lightbulb
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
  action?: () => void;
}

interface TokenEconomyGuide {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  examples: string[];
  tips: string[];
}

export const OnboardingGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [showTokenGuide, setShowTokenGuide] = useState(false);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to ConnectUS!',
      description: 'Learn how to earn CU tokens and build your digital presence',
      icon: Sparkles,
      completed: true
    },
    {
      id: 'create-post',
      title: 'Create Your First Post',
      description: 'Share your thoughts and start earning CU tokens',
      icon: MessageCircle,
      completed: false,
      action: () => setShowGuide(false)
    },
    {
      id: 'engage',
      title: 'Engage with Community',
      description: 'Like, comment, and share to earn more rewards',
      icon: Heart,
      completed: false
    },
    {
      id: 'explore',
      title: 'Explore Content',
      description: 'Discover trending posts and connect with creators',
      icon: TrendingUp,
      completed: false
    },
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Add bio, achievements, and showcase your work',
      icon: UserCheck,
      completed: false
    }
  ];

  const tokenEconomyGuides: TokenEconomyGuide[] = [
    {
      title: 'Earning CU Tokens',
      description: 'How to earn rewards for quality contributions',
      icon: Coins,
      examples: [
        'Create engaging posts (+5-20 CU per post)',
        'Receive likes and comments (+1-5 CU per interaction)',
        'Help others with valuable comments (+2-10 CU)',
        'Share trending content (+3-15 CU)',
        'Complete daily challenges (+10-50 CU)'
      ],
      tips: [
        'Quality content earns more than quantity',
        'Engage authentically with the community',
        'Post regularly to build momentum',
        'Use relevant hashtags to increase visibility'
      ]
    },
    {
      title: 'Using CU Tokens',
      description: 'What you can do with your earned tokens',
      icon: Gift,
      examples: [
        'Boost your posts to reach more people',
        'Tip other creators for great content',
        'Unlock premium profile features',
        'Participate in exclusive events',
        'Redeem for platform benefits'
      ],
      tips: [
        'Save tokens for important boosts',
        'Support creators you appreciate',
        'Tokens never expire',
        'Earn more by being active daily'
      ]
    },
    {
      title: 'Token Economics',
      description: 'Understanding the CU token system',
      icon: BarChart3,
      examples: [
        'Fixed supply prevents inflation',
        'Earning rate adjusts based on activity',
        'Community voting on token distribution',
        'Transparent blockchain tracking',
        'Fair distribution algorithm'
      ],
      tips: [
        'Early adopters earn more tokens',
        'Community quality affects rewards',
        'Tokens are stored securely on blockchain',
        'No central authority controls distribution'
      ]
    }
  ];

  const communityFeatures = [
    {
      title: 'Groups & Communities',
      description: 'Join topic-based groups to connect with like-minded creators',
      icon: Users,
      status: 'Coming Soon',
      features: ['Topic-based groups', 'Community challenges', 'Group rewards', 'Moderated discussions']
    },
    {
      title: 'Events & Meetups',
      description: 'Participate in virtual and real-world events',
      icon: Calendar,
      status: 'Coming Soon',
      features: ['Virtual meetups', 'Live streaming', 'Event rewards', 'Community building']
    },
    {
      title: 'Collaborative Projects',
      description: 'Work together on creative projects and earn shared rewards',
      icon: Target,
      status: 'Coming Soon',
      features: ['Project collaboration', 'Shared rewards', 'Team challenges', 'Creative partnerships']
    }
  ];

  const contentDiscoveryFeatures = [
    {
      title: 'Smart Recommendations',
      description: 'AI-powered content suggestions based on your interests',
      icon: TrendingUp,
      status: 'Active',
      features: ['Personalized feed', 'Interest-based suggestions', 'Trending content', 'Discovery algorithm']
    },
    {
      title: 'Advanced Search',
      description: 'Find exactly what you\'re looking for with powerful search',
      icon: Search,
      status: 'Active',
      features: ['Hashtag search', 'Content filtering', 'User discovery', 'Advanced filters']
    },
    {
      title: 'Content Curation',
      description: 'Curated collections and featured content',
      icon: Bookmark,
      status: 'Coming Soon',
      features: ['Editorial picks', 'Theme collections', 'Featured creators', 'Weekly highlights']
    }
  ];

  const progress = (onboardingSteps.filter(step => step.completed).length / onboardingSteps.length) * 100;

  return (
    <>
      {/* Onboarding Progress Card */}
      <Card className="card-hover mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Getting Started</CardTitle>
                <CardDescription>
                  Complete these steps to unlock your full potential
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="h-2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {onboardingSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                  step.completed
                    ? 'bg-success/10 border-success/20 text-success'
                    : index === currentStep
                    ? 'bg-primary/10 border-primary/20 text-primary'
                    : 'bg-muted/50 border-muted text-muted-foreground'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed
                    ? 'bg-success text-white'
                    : index === currentStep
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{step.title}</p>
                  <p className="text-xs opacity-75 truncate">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTokenGuide(true)}
              className="text-xs"
            >
              <Gift className="w-3 h-3 mr-1" />
              Learn About CU Tokens
            </Button>
            
            <Button
              size="sm"
              onClick={() => setShowGuide(true)}
              className="btn-primary text-xs"
            >
              <BookOpen className="w-3 h-3 mr-1" />
              View Full Guide
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Token Economy Guide Dialog */}
      <Dialog open={showTokenGuide} onOpenChange={setShowTokenGuide}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-primary" />
              <span>CU Token Economy Guide</span>
            </DialogTitle>
            <DialogDescription>
              Learn how to earn, use, and understand CU tokens in ConnectUS
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {tokenEconomyGuides.map((guide, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center">
                      <guide.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <CardDescription>{guide.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center">
                      <Zap className="w-4 h-4 mr-1 text-accent" />
                      Examples
                    </h4>
                    <ul className="space-y-1">
                      {guide.examples.map((example, i) => (
                        <li key={i} className="text-sm flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-1 text-success" />
                      Pro Tips
                    </h4>
                    <ul className="space-y-1">
                      {guide.tips.map((tip, i) => (
                        <li key={i} className="text-sm flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-success rounded-full mt-2 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Onboarding Guide Dialog */}
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>Complete ConnectUS Guide</span>
            </DialogTitle>
            <DialogDescription>
              Everything you need to know about ConnectUS features and community
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Community Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                Community Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {communityFeatures.map((feature, index) => (
                  <Card key={index} className="card-hover">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center">
                            <feature.icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{feature.title}</CardTitle>
                            <CardDescription className="text-xs">{feature.description}</CardDescription>
                          </div>
                        </div>
                        <Badge variant={feature.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                          {feature.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1">
                        {feature.features.map((item, i) => (
                          <li key={i} className="text-xs flex items-center space-x-2">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Content Discovery */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Content Discovery
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contentDiscoveryFeatures.map((feature, index) => (
                  <Card key={index} className="card-hover">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center">
                            <feature.icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{feature.title}</CardTitle>
                            <CardDescription className="text-xs">{feature.description}</CardDescription>
                          </div>
                        </div>
                        <Badge variant={feature.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                          {feature.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1">
                        {feature.features.map((item, i) => (
                          <li key={i} className="text-xs flex items-center space-x-2">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-accent" />
                Quick Tips for Success
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="card-hover">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3 h-3 text-success" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Post Regularly</p>
                          <p className="text-xs text-muted-foreground">Consistency builds your audience and earns more tokens</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Heart className="w-3 h-3 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Engage Authentically</p>
                          <p className="text-xs text-muted-foreground">Meaningful interactions earn more rewards than spam</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Hash className="w-3 h-3 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Use Hashtags</p>
                          <p className="text-xs text-muted-foreground">Relevant hashtags help others discover your content</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-hover">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Eye className="w-3 h-3 text-warning" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Quality Over Quantity</p>
                          <p className="text-xs text-muted-foreground">Well-crafted posts earn more than rushed content</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="w-3 h-3 text-secondary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Build Connections</p>
                          <p className="text-xs text-muted-foreground">Network with other creators to grow together</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Award className="w-3 h-3 text-success" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Track Progress</p>
                          <p className="text-xs text-muted-foreground">Monitor your earnings and engagement metrics</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}; 