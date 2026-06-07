import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const users = localStorage.getItem('ali_users');
    if (users) {
      return JSON.parse(users);
    }
    const defaultAdmin = {
      firstName: 'Admin',
      lastName: 'Ali',
      username: 'admin',
      email: 'admin@ali.com',
      gender: 'Male',
      role: 'Admin',
      password: 'admin',
      avatar: null,
      emailVerified: true,
    };
    localStorage.setItem('ali_users', JSON.stringify([defaultAdmin]));
    return [defaultAdmin];
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('ali_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [feedbackList, setFeedbackList] = useState(() => {
    const saved = localStorage.getItem('ali_feedback');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const session = localStorage.getItem('ali_session');
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  const emailExists = (email) => {
    return registeredUsers.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  };

  const register = (userData) => {
    const { confirmPassword, ...cleanData } = userData;
    const normalizedUser = {
      ...cleanData,
      email: cleanData.email.toLowerCase(),
      emailVerified: true,
    };

    const updatedUsers = [...registeredUsers, normalizedUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('ali_users', JSON.stringify(updatedUsers));
    return { success: true };
  };

  const login = (email, password) => {
    const foundUser = registeredUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
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
    const userIndex = registeredUsers.findIndex(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (userIndex > -1) {
      const updatedUsers = [...registeredUsers];
      updatedUsers[userIndex].password = newPassword;
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('ali_users', JSON.stringify(updatedUsers));

      if (user && user.email.toLowerCase() === email.toLowerCase()) {
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
        selectedSize,
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

  const submitFeedback = (message, type = 'suggestion', guestInfo = {}) => {
    const entry = {
      id: Date.now(),
      message,
      type,
      username: guestInfo.username || user?.username || 'Guest',
      email: guestInfo.email || user?.email || 'anonymous@guest.com',
      date: new Date().toISOString(),
    };
    const updated = [entry, ...feedbackList];
    setFeedbackList(updated);
    localStorage.setItem('ali_feedback', JSON.stringify(updated));
    return entry;
  };

  const deleteFeedback = (id) => {
    const updated = feedbackList.filter((f) => f.id !== id);
    setFeedbackList(updated);
    localStorage.setItem('ali_feedback', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        registeredUsers,
        register,
        login,
        logout,
        resetPassword,
        emailExists,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        feedbackList,
        submitFeedback,
        deleteFeedback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
