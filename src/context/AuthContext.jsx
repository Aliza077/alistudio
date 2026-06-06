import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  // Load active session and users list from localStorage on mount
  useEffect(() => {
    const session = localStorage.getItem('ali_session');
    if (session) {
      setUser(JSON.parse(session));
    }
    const users = localStorage.getItem('ali_users');
    if (users) {
      setRegisteredUsers(JSON.parse(users));
    } else {
      // Seed default admin account
      const defaultAdmin = {
        firstName: 'Admin',
        lastName: 'Ali',
        username: 'admin',
        email: 'admin@ali.com',
        gender: 'Male',
        role: 'Admin',
        password: 'admin'
      };
      localStorage.setItem('ali_users', JSON.stringify([defaultAdmin]));
      setRegisteredUsers([defaultAdmin]);
    }
  }, []);

  const register = (userData) => {
    const updatedUsers = [...registeredUsers, userData];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('ali_users', JSON.stringify(updatedUsers));
    
    // Auto-login registered user
    setUser(userData);
    localStorage.setItem('ali_session', JSON.stringify(userData));
    return true;
  };

  const login = (email, password) => {
    const foundUser = registeredUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('ali_session', JSON.stringify(foundUser));
      return { success: true, user: foundUser };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ali_session');
  };

  return (
    <AuthContext.Provider value={{ user, registeredUsers, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
