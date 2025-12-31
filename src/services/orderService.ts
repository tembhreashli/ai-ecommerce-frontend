import api from './api';
import { Order, CheckoutForm, ApiResponse } from '../types';

/**
 * Create new order
 */
export const createOrder = async (orderData: CheckoutForm): Promise<Order> => {
  const response = await api.post<ApiResponse<Order>>('/orders', orderData);
  return response.data.data;
};

/**
 * Get user orders
 */
export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get<ApiResponse<Order[]>>('/orders');
  return response.data.data;
};

/**
 * Get order by ID
 */
export const getOrderById = async (id: string): Promise<Order> => {
  const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
  return response.data.data;
};

/**
 * Cancel order
 */
export const cancelOrder = async (id: string): Promise<Order> => {
  const response = await api.put<ApiResponse<Order>>(`/orders/${id}/cancel`);
  return response.data.data;
};

/**
 * Get order history with pagination
 */
export const getOrderHistory = async (page: number = 1, limit: number = 10): Promise<{
  orders: Order[];
  total: number;
}> => {
  const response = await api.get<ApiResponse<{ orders: Order[]; total: number }>>(
    `/orders/history?page=${page}&limit=${limit}`
  );
  return response.data.data;
};
