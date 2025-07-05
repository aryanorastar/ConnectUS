import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { team4Social } from '@/lib/icp';
import { useToast } from '@/hooks/use-toast';
import {
  Menu,
  Home,
  Search as SearchIcon,
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
  TrendingUp,
  X,
  ChevronRight
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

interface HeaderProps {
  showNav?: boolean;
  showSearch?: boolean;
  showQuickPost?: boolean;
  showNotifications?: boolean;
  showBreadcrumbs?: boolean;
  showLogo?: boolean;
  showUserMenu?: boolean;
  breadcrumbs?: string[];
}

export const Header = ({
  showNav = true,
  showSearch = true,
  showQuickPost = true,
  showNotifications = true,
  showBreadcrumbs = false,
  showLogo = true,
  showUserMenu = true,
  breadcrumbs = []
}: HeaderProps) => {
  const { isAuthenticated, identity, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { toast } = useToast();

  // Mock notification count - in real app this would come from backend
  const notificationCount = 3;

  const isActive = (path: string) => location.pathname === path;

  // Generate dynamic breadcrumbs based on current location
  const getDynamicBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbMap: { [key: string]: string } = {
      'feed': 'Feed',
      'explore': 'Explore',
      'profile': 'Profile',
      'rewards': 'Rewards'
    };
    
    return pathSegments.map(segment => breadcrumbMap[segment] || segment);
  };

  const currentBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : getDynamicBreadcrumbs();

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
    { path: '/explore', label: 'Explore', icon: SearchIcon, description: 'Discover new content' },
    { path: '/profile', label: 'Profile', icon: User, description: 'Your profile & stats' },
  ];

  const quickActions = [
    { label: 'How to Earn CU', icon: Gift, action: () => navigate('/rewards') },
    { label: 'Community Guide', icon: BookOpen, action: () => navigate('/explore') },
    { label: 'Help & Support', icon: HelpCircle, action: () => toast({ title: 'Help', description: 'Support coming soon!' }) },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
      setIsSearchFocused(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-border shadow-sm safe-area-top">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          {showLogo && (
            <Link to={isAuthenticated ? "/feed" : "/"} className="flex items-center space-x-3 group">
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
          )}

          {/* Navigation */}
          {showNav && isAuthenticated && (
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path) 
                      ? 'bg-primary/10 text-primary font-semibold shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  title={item.description}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          )}

          {/* Enhanced Search Bar */}
          {showSearch && isAuthenticated && (
            <form onSubmit={handleSearch} className="hidden md:flex items-center ml-6 transition-all duration-300">
              <div className={`relative flex items-center ${isSearchFocused ? 'w-80' : 'w-64'}`}>
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search ConnectUS..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                />
                {searchValue && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 h-6 w-6"
                    onClick={() => setSearchValue('')}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </form>
          )}

          {/* Desktop Actions */}
          <div className="flex items-center space-x-2">
            {showQuickPost && isAuthenticated && (
              <Button
                className="btn-accent hidden md:inline-flex"
                onClick={() => navigate('/feed#new-post')}
                title="Create Post"
              >
                <Plus className="w-4 h-4 mr-1" />
                Post
              </Button>
            )}
            {showNotifications && isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                className="relative hidden md:inline-flex"
                onClick={() => toast({ title: 'Notifications', description: `You have ${notificationCount} new notifications` })}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full text-xs font-bold text-white flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Button>
            )}
            {showUserMenu && isAuthenticated ? (
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
                  <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !isAuthenticated ? (
              <Button 
                className="btn-gradient"
                onClick={() => navigate('/')}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            ) : null}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="px-4 py-6 border-b">
                  <SheetTitle className="text-left">ConnectUS Menu</SheetTitle>
                  <SheetDescription className="text-left">
                    Navigate and manage your account
                  </SheetDescription>
                </SheetHeader>
                <div className="p-4 space-y-4">
                  {showNav && isAuthenticated && (
                    <nav className="flex flex-col space-y-2">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive(item.path)
                              ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                          title={item.description}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}
                    </nav>
                  )}
                  {showSearch && isAuthenticated && (
                    <form onSubmit={handleSearch} className="flex items-center mt-4">
                      <div className="relative w-full">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search ConnectUS..."
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          value={searchValue}
                          onChange={e => setSearchValue(e.target.value)}
                        />
                      </div>
                    </form>
                  )}
                  {showQuickPost && isAuthenticated && (
                    <Button
                      className="btn-accent w-full mt-4"
                      onClick={() => {
                        navigate('/feed#new-post');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                  )}
                  {showNotifications && isAuthenticated && (
                    <Button
                      variant="ghost"
                      className="w-full mt-2 flex items-center justify-between"
                      onClick={() => toast({ title: 'Notifications', description: `You have ${notificationCount} new notifications` })}
                    >
                      <div className="flex items-center">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                      </div>
                      {notificationCount > 0 && (
                        <span className="w-5 h-5 bg-accent rounded-full text-xs font-bold text-white flex items-center justify-center">
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </span>
                      )}
                    </Button>
                  )}
                  {showUserMenu && isAuthenticated && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="w-12 h-12">
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
                  )}
                  {!isAuthenticated && (
                    <Button 
                      className="btn-gradient w-full mt-4"
                      onClick={() => {
                        navigate('/');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get Started
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Enhanced Breadcrumbs/Page Indicator */}
      {showBreadcrumbs && currentBreadcrumbs.length > 0 && (
        <div className="w-full bg-muted/40 border-b border-border">
          <div className="container mx-auto px-4 py-3 flex items-center space-x-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            {currentBreadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center">
                <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />
                <span className={idx === currentBreadcrumbs.length - 1 ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
};