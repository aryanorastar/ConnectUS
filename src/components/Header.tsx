import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { team4Social } from '@/lib/icp';
import { useToast } from '@/hooks/use-toast';
import { 
  Menu, 
  X, 
  Home, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  Plus,
  Bell,
  Gift,
  Sparkles,
  ChevronDown,
  HelpCircle,
  BookOpen,
  Users,
  TrendingUp
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export const Header = () => {
  const { isAuthenticated, identity, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
      toast({
        title: "Logged out successfully",
        description: "You've been signed out of ConnectUS.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSeedDemo = async () => {
    try {
      const result = await team4Social.seedDemoData();
      if (result[0]) {
        toast({ 
          title: 'Demo data seeded!', 
          description: 'Sample posts and users added to help you explore ConnectUS.' 
        });
      } else {
        toast({ 
          title: 'Demo data already exists', 
          description: 'Sample content is already available. Clear data to reseed.' 
        });
      }
    } catch (e) {
      toast({ 
        title: 'Error', 
        description: 'Failed to seed demo data. Please try again.',
        variant: "destructive"
      });
    }
  };

  const navigationItems = [
    { path: '/feed', label: 'Feed', icon: Home, description: 'Your personalized feed' },
    { path: '/explore', label: 'Explore', icon: Search, description: 'Discover new content' },
    { path: '/profile', label: 'Profile', icon: User, description: 'Your profile & stats' },
  ];

  const quickActions = [
    { label: 'How to Earn CU', icon: Gift, action: () => navigate('/rewards') },
    { label: 'Community Guide', icon: BookOpen, action: () => navigate('/explore') },
    { label: 'Help & Support', icon: HelpCircle, action: () => toast({ title: 'Help', description: 'Support coming soon!' }) },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-border shadow-sm safe-area-top">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
              <span className="text-white font-bold text-xl">CU</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-primary to-secondary">
                ConnectUS
              </h1>
              <p className="text-xs text-muted-foreground">Earn • Share • Connect</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path) 
                      ? 'bg-primary/10 text-primary font-semibold shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  onClick={() => toast({ title: 'Notifications', description: 'No new notifications' })}
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"></span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-tr from-primary to-secondary text-white text-sm">
                          {identity?.getPrincipal().toText().slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">ConnectUS User</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {identity?.getPrincipal().toText().slice(0, 8)}...
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/rewards')}>
                      <Gift className="mr-2 h-4 w-4" />
                      <span>Rewards</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSeedDemo}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      <span>Add Demo Data</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                className="btn-gradient"
                onClick={() => navigate('/')}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isAuthenticated && (
        <div className="md:hidden">
          <div className="mobile-nav">
            <div className="flex items-center justify-around py-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 px-3 py-2">
                    <Menu className="w-5 h-5" />
                    <span className="text-xs font-medium">More</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[60vh] rounded-t-xl">
                  <SheetHeader>
                    <SheetTitle>ConnectUS Menu</SheetTitle>
                    <SheetDescription>
                      Quick access to all features and settings
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    {/* Quick Actions */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-3">Quick Actions</h4>
                      <div className="space-y-2">
                        {quickActions.map((action) => (
                          <Button
                            key={action.label}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              action.action();
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <action.icon className="mr-3 h-4 w-4" />
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-tr from-primary to-secondary text-white">
                            {identity?.getPrincipal().toText().slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">ConnectUS User</p>
                          <p className="text-xs text-muted-foreground">
                            {identity?.getPrincipal().toText().slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            handleSeedDemo();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <Sparkles className="mr-3 h-4 w-4" />
                          Add Demo Data
                        </Button>
                        
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-destructive hover:text-destructive"
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          disabled={isLoggingOut}
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Banner for New Users */}
      {isAuthenticated && location.pathname === '/feed' && (
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Welcome to ConnectUS! 🎉
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Start earning CU tokens by creating your first post
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                className="btn-accent"
                onClick={() => navigate('/explore')}
              >
                Explore
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};