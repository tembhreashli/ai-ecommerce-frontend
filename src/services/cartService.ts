import api from './api';
import { Cart, CartItem, ApiResponse } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Get user cart
 */
export const getCart = async (): Promise<Cart> => {
  const response = await api.get<ApiResponse<Cart>>('/cart');
  return response.data.data;
};

/**
 * Add item to cart
 */
export const addToCart = async (productId: string, quantity: number = 1): Promise<Cart> => {
  const response = await api.post<ApiResponse<Cart>>('/cart/items', {
    productId,
    quantity,
  });
  
  // Update local cart cache
  localStorage.setItem(STORAGE_KEYS.CART_DATA, JSON.stringify(response.data.data));
  
  return response.data.data;
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (itemId: string, quantity: number): Promise<Cart> => {
  const response = await api.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, {
    quantity,
  });
  
  // Update local cart cache
  localStorage.setItem(STORAGE_KEYS.CART_DATA, JSON.stringify(response.data.data));
  
  return response.data.data;
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (itemId: string): Promise<Cart> => {
  const response = await api.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
  
  // Update local cart cache
  localStorage.setItem(STORAGE_KEYS.CART_DATA, JSON.stringify(response.data.data));
  
  return response.data.data;
};

/**
 * Clear cart
 */
export const clearCart = async (): Promise<void> => {
  await api.delete('/cart');
  
  // Clear local cart cache
  localStorage.removeItem(STORAGE_KEYS.CART_DATA);
};

/**
 * Get local cart (for guest users)
 */
export const getLocalCart = (): Cart => {
  const cartData = localStorage.getItem(STORAGE_KEYS.CART_DATA);
  return cartData ? JSON.parse(cartData) : { items: [], total: 0, itemCount: 0 };
};

/**
 * Sync local cart with server
 */
export const syncCart = async (localCart: Cart): Promise<Cart> => {
  const response = await api.post<ApiResponse<Cart>>('/cart/sync', localCart);
  localStorage.setItem(STORAGE_KEYS.CART_DATA, JSON.stringify(response.data.data));
  return response.data.data;
};
