import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import API_BASE_URL from '../config';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart: from backend if logged in, else from localStorage
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // Sync guest cart to backend if items exist
        const guestCart = localStorage.getItem('shopez_guest_cart');
        if (guestCart) {
          try {
            const items = JSON.parse(guestCart);
            setLoading(true);
            // Sequentially post guest items to backend
            for (const item of items) {
              await axios.post(`${API_BASE_URL}/cart`, {
                productId: item.product._id,
                quantity: item.quantity
              });
            }
            localStorage.removeItem('shopez_guest_cart');
          } catch (err) {
            console.error('Error merging guest cart to database:', err.message);
          }
        }
        // Fetch cart from backend
        fetchBackendCart();
      } else {
        // Load guest cart from local storage
        const localCart = localStorage.getItem('shopez_guest_cart');
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        } else {
          setCartItems([]);
        }
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  const fetchBackendCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE_URL}/cart`);
      if (res.data.success) {
        setCartItems(res.data.cart.items || []);
      }
    } catch (err) {
      console.error('Error fetching cart:', err.message);
      setError(err.response?.data?.message || 'Failed to fetch cart from server');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    const qty = Number(quantity);
    if (user) {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.post(`${API_BASE_URL}/cart`, {
          productId: product._id,
          quantity: qty
        });
        if (res.data.success) {
          setCartItems(res.data.cart.items || []);
          return { success: true };
        }
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to add item to database cart';
        setError(errMsg);
        return { success: false, message: errMsg };
      } finally {
        setLoading(false);
      }
    } else {
      // Handle local storage cart updating
      const updatedItems = [...cartItems];
      const itemIndex = updatedItems.findIndex(item => item.product._id === product._id);

      if (itemIndex > -1) {
        updatedItems[itemIndex].quantity += qty;
      } else {
        updatedItems.push({ product, quantity: qty });
      }

      setCartItems(updatedItems);
      localStorage.setItem('shopez_guest_cart', JSON.stringify(updatedItems));
      return { success: true };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const qty = Number(quantity);
    if (user) {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.put(`${API_BASE_URL}/cart`, {
          productId,
          quantity: qty
        });
        if (res.data.success) {
          setCartItems(res.data.cart.items || []);
          return { success: true };
        }
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to update item quantity';
        setError(errMsg);
        return { success: false, message: errMsg };
      } finally {
        setLoading(false);
      }
    } else {
      let updatedItems = [...cartItems];
      const itemIndex = updatedItems.findIndex(item => item.product._id === productId);

      if (itemIndex > -1) {
        if (qty <= 0) {
          updatedItems = updatedItems.filter(item => item.product._id !== productId);
        } else {
          updatedItems[itemIndex].quantity = qty;
        }
        setCartItems(updatedItems);
        localStorage.setItem('shopez_guest_cart', JSON.stringify(updatedItems));
      }
      return { success: true };
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.delete(`${API_BASE_URL}/cart/${productId}`);
        if (res.data.success) {
          setCartItems(res.data.cart.items || []);
          return { success: true };
        }
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to remove item from cart';
        setError(errMsg);
        return { success: false, message: errMsg };
      } finally {
        setLoading(false);
      }
    } else {
      const updatedItems = cartItems.filter(item => item.product._id !== productId);
      setCartItems(updatedItems);
      localStorage.setItem('shopez_guest_cart', JSON.stringify(updatedItems));
      return { success: true };
    }
  };

  // Helper properties
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      error,
      addToCart,
      updateQuantity,
      removeFromCart,
      cartCount,
      cartTotal,
      fetchBackendCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
