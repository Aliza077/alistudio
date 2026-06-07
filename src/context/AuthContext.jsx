import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const users = localStorage.getItem('ali_users');
    if (users) {
      return JSON.parse(users);
    }
    // Seed default admin account
    const defaultAdmin = {
      firstName: 'Admin',
      lastName: 'Ali',
      username: 'admin',
      email: 'admin@ali.com',
      gender: 'Male',
      role: 'Admin',
      password: 'admin',
      avatar: null
    };
    localStorage.setItem('ali_users', JSON.stringify([defaultAdmin]));
    return [defaultAdmin];
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('ali_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Load active session on mount
  useEffect(() => {
    const session = localStorage.getItem('ali_session');
    if (session) {
      setUser(JSON.parse(session));
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

  const resetPassword = (email, newPassword) => {
    const userIndex = registeredUsers.findIndex((u) => u.email === email);
    if (userIndex > -1) {
      const updatedUsers = [...registeredUsers];
      updatedUsers[userIndex].password = newPassword;
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('ali_users', JSON.stringify(updatedUsers));
      
      // If the currently logged-in user is resetting their password, update their session
      if (user && user.email === email) {
        const updatedSession = { ...user, password: newPassword };
        setUser(updatedSession);
        localStorage.setItem('ali_session', JSON.stringify(updatedSession));
      }
      return true;
    }
    return false;
  };

  const saveCartToStorage = (newCart) => {
    setCart(newCart);
    localStorage.setItem('ali_cart', JSON.stringify(newCart));
  };

  const addToCart = (product, quantity = 1, selectedColor = '', selectedSize = '') => {
    // Generate a unique cart item ID based on product ID, color, and size
    const cartItemId = `${product.id}-${selectedColor.replace(/\s+/g, '')}-${selectedSize}`;
    
    const existingIndex = cart.findIndex((item) => item.cartItemId === cartItemId);
    let updatedCart = [...cart];
    
    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({
        cartItemId,
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity,
        selectedColor,
        selectedSize
      });
    }
    saveCartToStorage(updatedCart);
  };

  const removeFromCart = (cartItemId) => {
    const updatedCart = cart.filter((item) => item.cartItemId !== cartItemId);
    saveCartToStorage(updatedCart);
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const updatedCart = cart.map((item) => 
      item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
    );
    saveCartToStorage(updatedCart);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      registeredUsers, 
      register, 
      login, 
      logout,
      resetPassword,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
