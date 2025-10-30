import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { login as apiLogin, getCurrentUserInfo } from '../api';
import { AuthenticationRequest, User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: AuthenticationRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  }, []);

  const fetchUser = useCallback(async (currentToken: string) => {
    // No need to set loading to true here, it's handled by the initial state
    try {
      const userInfo = await getCurrentUserInfo(currentToken);
      setUser(userInfo);
    } catch (error) {
      console.error("Phiên đăng nhập không hợp lệ, đang đăng xuất:", error);
      // If fetching user fails (e.g., token expired), log out
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      fetchUser(token);
    } else {
      setIsLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (credentials: AuthenticationRequest) => {
    // The API response for login is an object containing the token
    const authResponse = await apiLogin(credentials);
    const newToken = authResponse.token;
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    // After setting the token, the useEffect will trigger fetchUser
  };

  const isAuthenticated = !!token && !!user;
  // According to OpenAPI spec, user object from myInfo doesn't contain roles.
  // The sample credentials suggest a hardcoded admin user.
  // For a real app, you'd likely get roles from the token or another endpoint.
  // Here, we'll assume the user 'admin' is the admin. A more robust solution is needed for production.
  const isAdmin = user?.username === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, isAuthenticated, isAdmin }}>
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
