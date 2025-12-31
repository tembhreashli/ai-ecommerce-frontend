import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import {
  fetchCart,
  addToCart as addToCartAction,
  updateCartItem as updateCartItemAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
} from '../store/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, itemCount, loading, error } = useSelector(
    (state: RootState) => state.cart
  );

  const loadCart = async () => {
    await dispatch(fetchCart());
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    return await dispatch(addToCartAction({ productId, quantity }));
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    return await dispatch(updateCartItemAction({ itemId, quantity }));
  };

  const removeFromCart = async (itemId: string) => {
    return await dispatch(removeFromCartAction(itemId));
  };

  const clearCart = async () => {
    return await dispatch(clearCartAction());
  };

  const getItemQuantity = (productId: string): number => {
    const item = items.find((item) => item.productId === productId);
    return item?.quantity || 0;
  };

  const isInCart = (productId: string): boolean => {
    return items.some((item) => item.productId === productId);
  };

  return {
    items,
    total,
    itemCount,
    loading,
    error,
    loadCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getItemQuantity,
    isInCart,
  };
};
