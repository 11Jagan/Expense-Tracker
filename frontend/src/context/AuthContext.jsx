import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, login, logout, register, updateUserProfile } from '../api/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on initial load
    const initAuth = () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        // Check if token is expired
        const token = localStorage.getItem('token');
        const loginTime = localStorage.getItem('loginTime');
        const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        if (token && loginTime) {
          const timeElapsed = Date.now() - parseInt(loginTime);
          if (timeElapsed > expirationTime) {
            // Token expired, logout user
            logout();
            setUser(null);
          } else {
            setUser(currentUser);
          }
        } else {
          setUser(currentUser);
        }
      }
      setLoading(false);
    };

    initAuth();
    
    // Set up interval to check token expiration every 5 minutes
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      const loginTime = localStorage.getItem('loginTime');
      const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
      
      if (token && loginTime) {
        const timeElapsed = Date.now() - parseInt(loginTime);
        if (timeElapsed > expirationTime) {
          logout();
          setUser(null);
          window.location.href = '/landing';
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  // Register a new user
  const registerUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await register(userData);
      setUser(data);
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const loginUser = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(credentials);
      // Store login time for session management
      localStorage.setItem('loginTime', Date.now().toString());
      setUser(data);
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logoutUser = () => {
    logout();
    localStorage.removeItem('loginTime');
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateUserProfile(userData);
      setUser(data);
      return data;
    } catch (err) {
      setError(err.message || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        registerUser,
        loginUser,
        logoutUser,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;