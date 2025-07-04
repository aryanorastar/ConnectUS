import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LandingPage } from '@/components/LandingPage';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, login } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/feed');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const loginSuccess = await login();
      if (loginSuccess) {
        console.log('Login successful, redirecting to feed...');
        navigate('/feed');
      } else {
        console.log('Login failed or was cancelled');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Show loading state while checking auth status or connecting
  if (loading || isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          {isConnecting && <p className="text-muted-foreground">Connecting to Internet Identity...</p>}
        </div>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return <LandingPage onConnect={handleConnect} />;
  }

  // Return null while redirecting
  return null;
};

export default Index;
