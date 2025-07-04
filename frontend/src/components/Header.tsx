import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const Header = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [tokenBalance] = useState(1250);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">T4</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Team4 Social</h1>
            <p className="text-xs text-muted-foreground">On-Chain Network</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/feed" 
            className={`text-sm font-medium transition-colors ${
              isActive('/feed') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            Feed
          </Link>
          <Link 
            to="/explore" 
            className={`text-sm font-medium transition-colors ${
              isActive('/explore') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            Explore
          </Link>
          <Link 
            to="/rewards" 
            className={`text-sm font-medium transition-colors ${
              isActive('/rewards') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            Rewards
          </Link>
          <Link 
            to="/profile" 
            className={`text-sm font-medium transition-colors ${
              isActive('/profile') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            Profile
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {isConnected && (
            <>
              <Badge variant="secondary" className="text-sm">
                {tokenBalance} T4T
              </Badge>
              <Link to="/profile">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">ME</AvatarFallback>
                </Avatar>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};