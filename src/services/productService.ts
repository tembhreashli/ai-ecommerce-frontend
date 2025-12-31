import api from './api';
import { Product, ProductFilters, ApiResponse, Pagination } from '../types';

export interface ProductListResponse {
  products: Product[];
  pagination: Pagination;
}

/**
 * Get all products with filters
 */
export const getProducts = async (
  filters?: ProductFilters,
  page: number = 1,
  limit: number = 12
): Promise<ProductListResponse> => {
  const params = new URLSearchParams();
  
  if (filters?.category) params.append('category', filters.category);
  if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
  if (filters?.search) params.append('search', filters.search);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  const response = await api.get<ApiResponse<ProductListResponse>>(
    `/products?${params.toString()}`
  );
  return response.data.data;
};

/**
 * Get product by ID
 */
export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
  return response.data.data;
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (): Promise<Product[]> => {
  const response = await api.get<ApiResponse<Product[]>>('/products/featured');
  return response.data.data;
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const response = await api.get<ApiResponse<Product[]>>(`/products/category/${category}`);
  return response.data.data;
};

/**
 * Search products
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
  const response = await api.get<ApiResponse<Product[]>>(`/products/search?q=${query}`);
  return response.data.data;
};

/**
 * Get product recommendations (AI-powered)
 */
export const getRecommendations = async (productId?: string): Promise<Product[]> => {
  const url = productId 
    ? `/products/recommendations/${productId}`
    : '/products/recommendations';
  const response = await api.get<ApiResponse<Product[]>>(url);
  return response.data.data;
};
