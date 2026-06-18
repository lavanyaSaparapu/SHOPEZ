import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import API_BASE_URL from '../config';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load wishlist: from backend if logged in, else from localStorage
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        // Sync guest wishlist if items exist
        const guestWishlist = localStorage.getItem('shopez_guest_wishlist');
        if (guestWishlist) {
          try {
            const products = JSON.parse(guestWishlist);
            setLoading(true);
            for (const prod of products) {
              await axios.post(`${API_BASE_URL}/wishlist`, {
                productId: prod._id
              });
            }
            localStorage.removeItem('shopez_guest_wishlist');
          } catch (err) {
            console.error('Error merging guest wishlist to database:', err.message);
          }
        }
        fetchBackendWishlist();
      } else {
        const localWishlist = localStorage.getItem('shopez_guest_wishlist');
        if (localWishlist) {
          setWishlistItems(JSON.parse(localWishlist));
        } else {
          setWishlistItems([]);
        }
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user]);

  const fetchBackendWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_BASE_URL}/wishlist`);
      if (res.data.success) {
        setWishlistItems(res.data.wishlist.products || []);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err.message);
      setError(err.response?.data?.message || 'Failed to fetch wishlist from server');
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product) => {
    if (user) {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.post(`${API_BASE_URL}/wishlist`, {
          productId: product._id
        });
        if (res.data.success) {
          setWishlistItems(res.data.wishlist.products || []);
          const isAdded = res.data.wishlist.products.some(item => item._id === product._id);
          return { success: true, isAdded, message: res.data.message };
        }
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to update wishlist in database';
        setError(errMsg);
        return { success: false, message: errMsg };
      } finally {
        setLoading(false);
      }
    } else {
      let updatedItems = [...wishlistItems];
      const itemIndex = updatedItems.findIndex(item => item._id === product._id);
      let isAdded = false;
      let message = '';

      if (itemIndex > -1) {
        updatedItems.splice(itemIndex, 1);
        message = 'Product removed from wishlist';
      } else {
        updatedItems.push(product);
        isAdded = true;
        message = 'Product added to wishlist';
      }

      setWishlistItems(updatedItems);
      localStorage.setItem('shopez_guest_wishlist', JSON.stringify(updatedItems));
      return { success: true, isAdded, message };
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      loading,
      error,
      toggleWishlist,
      isInWishlist,
      fetchBackendWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
