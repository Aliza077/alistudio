import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mapApiUser, getStoredToken, getAuthHeaders } from '../utils/authHelpers';
import { fetchWithTimeout } from '../utils/fetchWithTimeout';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());
  const [authLoading, setAuthLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('ali_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [feedbackList, setFeedbackList] = useState(() => {
    const saved = localStorage.getItem('ali_feedback');
    return saved ? JSON.parse(saved) : [];
  });

  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem('ali_favourites');
    return saved ? JSON.parse(saved) : [];
  });

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ali_token');
    localStorage.removeItem('ali_session');
  }, []);

  const persistSession = useCallback((loggedUser, authToken) => {
    setUser(loggedUser);
    setToken(authToken);
    localStorage.setItem('ali_token', authToken);
    localStorage.setItem('ali_session', JSON.stringify(loggedUser));
  }, []);

  useEffect(() => {
    async function bootstrapAuth() {
      const storedToken = getStoredToken();
      if (!storedToken) {
        logout();
        setAuthLoading(false);
        return;
      }

      try {
        const res = await fetchWithTimeout('/api/user/me', {
          headers: getAuthHeaders(storedToken),
        }, 6000);
        const data = await res.json();

        if (res.ok) {
          const loggedUser = mapApiUser(data.data);
          persistSession(loggedUser, storedToken);
        } else {
          logout();
        }
      } catch {
        const session = localStorage.getItem('ali_session');
        if (session) {
          setUser(JSON.parse(session));
          setToken(storedToken);
        } else {
          logout();
        }
      } finally {
        setAuthLoading(false);
      }
    }

    bootstrapAuth();
  }, [logout, persistSession]);

  const register = async (userData) => {
    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${userData.firstName} ${userData.lastName}`.trim() || userData.username,
          username: userData.username,
          email: userData.email,
          phone: userData.phone || '',
          gender: userData.gender || '',
          password: userData.password,
          image: userData.avatar || '',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const loggedUser = mapApiUser(data.data);
      persistSession(loggedUser, data.token);
      return { success: true, user: loggedUser };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const resetPassword = async (email, code, newPassword) => {
    try {
      const res = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, forgotpasswordcode: code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      return { success: true };
    } catch (error) {
      console.error('Reset Password Error:', error);
      return { success: false, message: error.message };
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/user/list', {
        headers: getAuthHeaders(token),
      });
      const data = await res.json();
      if (res.ok) {
        setUsersList(data.data);
        return data.data;
      }
      if (res.status === 401) {
        logout();
      }
      return [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const deleteUser = async (userId) => {
    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });
      const data = await res.json();
      if (res.ok) {
        setUsersList((prev) => prev.filter((usr) => usr._id !== userId));
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Failed to delete user.' };
    } catch (error) {
      console.error('Delete User Error:', error);
      return { success: false, message: error.message };
    }
  };

  const updateUserRole = async (userId, urole) => {
    try {
      const id = String(userId || '');
      if (!id) {
        return { success: false, message: 'Invalid user id.' };
      }

      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders(token),
      };
      const body = JSON.stringify({ urole });
      let res = await fetch(`/api/user/role/${id}`, { method: 'PUT', headers, body });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return {
          success: false,
          message: 'Backend API not reachable. Stop all node processes and run: cd project && npm run dev:all',
        };
      }

      const data = await res.json();
      if (res.ok) {
        setUsersList((prev) =>
          prev.map((usr) => {
            const usrId = String(usr._id || usr.id);
            return usrId === id ? { ...usr, urole } : usr;
          })
        );
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Failed to update role.' };
    } catch (error) {
      return { success: false, message: error.message || 'Network error while updating role.' };
    }
  };

  const saveCartToStorage = (newCart) => {
    setCart(newCart);
    localStorage.setItem('ali_cart', JSON.stringify(newCart));
  };

  const addToCart = (product, quantity = 1, selectedColor = '', selectedSize = '') => {
    const pId = product._id || product.id;
    const cartItemId = `${pId}-${selectedColor.replace(/\s+/g, '')}-${selectedSize}`;
    const existingIndex = cart.findIndex((item) => item.cartItemId === cartItemId);
    let updatedCart = [...cart];

    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({
        cartItemId,
        productId: pId,
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

  const addToFavourites = (product) => {
    const pId = product._id || product.id;
    if (!favourites.some((item) => (item._id || item.id) === pId)) {
      const updated = [...favourites, product];
      setFavourites(updated);
      localStorage.setItem('ali_favourites', JSON.stringify(updated));
    }
  };

  const removeFromFavourites = (productId) => {
    const updated = favourites.filter((item) => (item._id || item.id) !== productId);
    setFavourites(updated);
    localStorage.setItem('ali_favourites', JSON.stringify(updated));
  };

  const isFavourite = (productId) => {
    return favourites.some((item) => (item._id || item.id) === productId);
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authLoading,
        isAdmin,
        usersList,
        register,
        login,
        logout,
        resetPassword,
        fetchUsers,
        deleteUser,
        updateUserRole,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        feedbackList,
        submitFeedback,
        deleteFeedback,
        favourites,
        addToFavourites,
        removeFromFavourites,
        isFavourite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
