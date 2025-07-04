import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { team4Social } from '@/lib/icp';
import { useToast } from '@/hooks/use-toast';

export const Header = () => {
  const { isAuthenticated, identity, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSeedDemo = async () => {
    try {
      const result = await team4Social.seedDemoData();
      if (result[0]) {
        toast({ title: 'Demo data seeded!', description: 'Dummy users, posts, and hashtags added.' });
      } else {
        toast({ title: 'Demo data already exists', description: 'Posts already present. Clear data to reseed.' });
      }
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to seed demo data.' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-border shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-400 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl drop-shadow">CU</span>
          </div>
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-indigo-600 to-purple-500">ConnectUS</h1>
        </Link>

        {/* Navigation */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/feed" 
              className={`text-base font-semibold px-3 py-1 rounded-lg transition-colors ${
                isActive('/feed') ? 'bg-indigo-100 text-indigo-700' : 'text-muted-foreground hover:bg-indigo-50 hover:text-indigo-700'
              }`}
            >
              Feed
            </Link>
            <Link 
              to="/explore" 
              className={`text-base font-semibold px-3 py-1 rounded-lg transition-colors ${
                isActive('/explore') ? 'bg-indigo-100 text-indigo-700' : 'text-muted-foreground hover:bg-indigo-50 hover:text-indigo-700'
              }`}
            >
              Explore
            </Link>
            <Link 
              to="/profile" 
              className={`text-base font-semibold px-3 py-1 rounded-lg transition-colors ${
                isActive('/profile') ? 'bg-indigo-100 text-indigo-700' : 'text-muted-foreground hover:bg-indigo-50 hover:text-indigo-700'
              }`}
            >
              Profile
            </Link>
          </nav>
        )}

        {/* Authentication */}
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-sm border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
              className="text-sm border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Connect
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};