import React, { createContext, useContext, useEffect, useState } from 'react';
import { Identity } from '@dfinity/agent';
import { initAuth, isAuthenticated, login, logout, getCurrentIdentity } from '@/lib/auth';

type AuthContextType = {
  isAuthenticated: boolean;
  identity: Identity | null;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await initAuth();
        const isAuth = await isAuthenticated();
        console.log('Auth status:', isAuth);
        if (isAuth) {
          const currentIdentity = getCurrentIdentity();
          console.log('Current identity:', currentIdentity?.getPrincipal().toString());
          setIdentity(currentIdentity);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userIdentity = await login();
      console.log('Login result:', userIdentity?.getPrincipal().toString());
      if (userIdentity) {
        setIdentity(userIdentity);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setIdentity(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!identity,
        identity,
        login: handleLogin,
        logout: handleLogout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
