import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, NotificationItem, Connection } from '../types';
import { storage } from '../services/storage';

interface AuthContextType {
  currentUser: User;
  allUsers: User[];
  connections: Connection[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  unreadMessagesCount: number;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string) => boolean;
  register: (userData: Partial<User>) => User;
  logout: () => void;
  switchPersona: (userId: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  refreshState: () => void;
  resetAllDemoData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(storage.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(storage.isAuthenticated());
  const [allUsers, setAllUsers] = useState<User[]>(storage.getAllUsers());
  const [connections, setConnections] = useState<Connection[]>(storage.getConnections(currentUser.id));
  const [notifications, setNotifications] = useState<NotificationItem[]>(storage.getNotifications(currentUser.id));

  const refreshState = useCallback(() => {
    const cur = storage.getCurrentUser();
    const isAuth = storage.isAuthenticated();
    setCurrentUser(cur);
    setIsAuthenticated(isAuth);
    setAllUsers(storage.getAllUsers());
    setConnections(storage.getConnections(cur.id));
    setNotifications(storage.getNotifications(cur.id));
  }, []);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  const switchPersona = (userId: string) => {
    const user = storage.setCurrentUser(userId);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setConnections(storage.getConnections(user.id));
      setNotifications(storage.getNotifications(user.id));
    }
  };

  const login = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = storage.getAllUsers().find(u => u.email.trim().toLowerCase() === cleanEmail);
    if (found) {
      switchPersona(found.id);
      return true;
    }
    return false;
  };

  const register = (userData: Partial<User>) => {
    const newUser = storage.registerUser(userData);
    refreshState();
    return newUser;
  };

  const logout = () => {
    storage.logout();
    refreshState();
  };

  const updateProfile = (updates: Partial<User>) => {
    const updated = storage.updateUser(currentUser.id, updates);
    setCurrentUser(updated);
    setAllUsers(storage.getAllUsers());
  };

  const resetAllDemoData = () => {
    storage.resetDatabase();
    refreshState();
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  // Compute unread messages count
  const unreadMessagesCount = storage.getAllUsers().reduce((count, otherUser) => {
    if (otherUser.id === currentUser.id) return count;
    const conv = storage.getConversation(currentUser.id, otherUser.id);
    const unread = conv.filter(m => m.receiverId === currentUser.id && !m.read).length;
    return count + unread;
  }, 0);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        connections,
        notifications,
        unreadNotifsCount,
        unreadMessagesCount,
        isAuthenticated,
        isAdmin: currentUser.role === 'admin',
        login,
        register,
        logout,
        switchPersona,
        updateProfile,
        refreshState,
        resetAllDemoData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
