# API Integration Guide

This guide covers how the frontend integrates with the backend API, including authentication, data fetching, error handling, and best practices.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [API Configuration](#api-configuration)
- [Authentication](#authentication)
- [API Services](#api-services)
- [Request/Response Patterns](#requestresponse-patterns)
- [Error Handling](#error-handling)
- [CORS Configuration](#cors-configuration)
- [API Endpoints Reference](#api-endpoints-reference)
- [Testing API Integration](#testing-api-integration)

## Architecture Overview

The frontend communicates with the backend through a REST API:

```
┌─────────────────┐         ┌──────────────┐         ┌─────────────────┐
│  React Frontend │ ◄────► │  Axios HTTP  │ ◄────► │  Backend API    │
│  (Port 5173)    │         │  Client      │         │  (Port 8080)    │
└─────────────────┘         └──────────────┘         └─────────────────┘
```

### Key Components

1. **Axios Instance** (`services/api.ts`): Pre-configured HTTP client
2. **Service Layer** (`services/*.ts`): API call abstractions
3. **Redux Slices** (`store/*.ts`): State management with async thunks
4. **Interceptors**: Request/response middleware for auth and errors

## API Configuration

### Environment Variables

API configuration is managed through environment variables:

**Local Development** (`.env.local`):
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000
```

**Docker Development** (`.env.docker`):
```env
VITE_API_BASE_URL=http://backend:8080/api
VITE_API_TIMEOUT=30000
```

**Production** (`.env`):
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_API_TIMEOUT=30000
```

### Axios Instance Setup

The base Axios instance is configured in `services/api.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

### Request Interceptor

Automatically adds authentication token to requests:

```typescript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### Response Interceptor

Handles common response scenarios:

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied');
    }

    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      console.error('Server error occurred');
    }

    return Promise.reject(error);
  }
);
```

## Authentication

### Login Flow

```typescript
// services/authService.ts
import api from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Store token and user data
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  refreshToken: async (): Promise<string> => {
    const response = await api.post<{ token: string }>('/auth/refresh');
    localStorage.setItem('token', response.data.token);
    return response.data.token;
  },
};
```

### JWT Token Management

Tokens are stored in `localStorage` and automatically included in requests:

```typescript
// Getting token
const token = localStorage.getItem('token');

// Setting token
localStorage.setItem('token', 'your-jwt-token');

// Removing token
localStorage.removeItem('token');
```

### Protected Routes

Routes that require authentication:

```typescript
// routes/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

## API Services

### Service Pattern

Each domain has its own service file:

```typescript
// services/productService.ts
import api from './api';
import { Product, ProductFilters } from '@/types';

export const productService = {
  // Get all products with optional filters
  getAll: async (filters?: ProductFilters): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get<Product[]>('/products', { params });
    return response.data;
  },

  // Get single product
  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Get featured products
  getFeatured: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/featured');
    return response.data;
  },

  // Get products by category
  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/products/category/${category}`);
    return response.data;
  },

  // Search products
  search: async (query: string): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/search', {
      params: { q: query },
    });
    return response.data;
  },
};
```

### Cart Service

```typescript
// services/cartService.ts
import api from './api';
import { Cart, CartItem } from '@/types';

export const cartService = {
  // Get user's cart
  getCart: async (): Promise<Cart> => {
    const response = await api.get<Cart>('/cart');
    return response.data;
  },

  // Add item to cart
  addItem: async (productId: number, quantity: number): Promise<CartItem> => {
    const response = await api.post<CartItem>('/cart/items', {
      productId,
      quantity,
    });
    return response.data;
  },

  // Update cart item quantity
  updateItem: async (itemId: number, quantity: number): Promise<CartItem> => {
    const response = await api.put<CartItem>(`/cart/items/${itemId}`, {
      quantity,
    });
    return response.data;
  },

  // Remove item from cart
  removeItem: async (itemId: number): Promise<void> => {
    await api.delete(`/cart/items/${itemId}`);
  },

  // Clear entire cart
  clearCart: async (): Promise<void> => {
    await api.delete('/cart');
  },
};
```

### Order Service

```typescript
// services/orderService.ts
import api from './api';
import { Order, OrderRequest } from '@/types';

export const orderService = {
  // Create new order
  createOrder: async (orderData: OrderRequest): Promise<Order> => {
    const response = await api.post<Order>('/orders', orderData);
    return response.data;
  },

  // Get all user orders
  getOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  // Get specific order
  getById: async (id: number): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id: number): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${id}/cancel`);
    return response.data;
  },
};
```

## Request/Response Patterns

### GET Requests

```typescript
// Simple GET
const products = await api.get<Product[]>('/products');

// GET with query parameters
const products = await api.get<Product[]>('/products', {
  params: {
    category: 'electronics',
    minPrice: 100,
    maxPrice: 1000,
  },
});

// GET with path parameters
const product = await api.get<Product>(`/products/${productId}`);
```

### POST Requests

```typescript
// POST with JSON body
const newProduct = await api.post<Product>('/products', {
  name: 'New Product',
  price: 99.99,
  description: 'Product description',
});

// POST with FormData (file upload)
const formData = new FormData();
formData.append('file', file);
formData.append('name', 'Product Name');

const response = await api.post('/products/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

### PUT/PATCH Requests

```typescript
// PUT - full update
const updated = await api.put<Product>(`/products/${id}`, {
  name: 'Updated Name',
  price: 149.99,
  description: 'Updated description',
});

// PATCH - partial update
const updated = await api.patch<Product>(`/products/${id}`, {
  price: 149.99,
});
```

### DELETE Requests

```typescript
// DELETE
await api.delete(`/products/${id}`);

// DELETE with body (if needed)
await api.delete('/cart/items', {
  data: { itemIds: [1, 2, 3] },
});
```

## Error Handling

### Try-Catch Pattern

```typescript
const fetchProduct = async (id: number) => {
  try {
    const product = await productService.getById(id);
    return product;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios error
      if (error.response) {
        // Server responded with error status
        console.error('Server error:', error.response.data);
        throw new Error(error.response.data.message || 'Server error');
      } else if (error.request) {
        // Request made but no response
        console.error('Network error:', error.request);
        throw new Error('Network error - please check your connection');
      }
    }
    // Other errors
    console.error('Unexpected error:', error);
    throw error;
  }
};
```

### Error Response Structure

Backend should return consistent error format:

```typescript
interface ErrorResponse {
  message: string;
  code: string;
  errors?: Record<string, string[]>;
}

// Example: Validation errors
{
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": {
    "email": ["Email is required", "Email must be valid"],
    "password": ["Password must be at least 8 characters"]
  }
}

// Example: Not found error
{
  "message": "Product not found",
  "code": "NOT_FOUND"
}
```

### Global Error Handling

Handle errors in Redux Toolkit:

```typescript
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getAll();
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: 'An unexpected error occurred' });
    }
  }
);
```

## CORS Configuration

### Backend CORS Setup

Backend must allow frontend origin:

**Development**:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization
```

**Production**:
```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Credentials: true
```

### Handling CORS Errors

If you see CORS errors:

1. **Verify backend CORS configuration**
2. **Check API URL** in environment variables
3. **Ensure credentials are included** if needed:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Send cookies
});
```

## API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | User login | No |
| POST | `/auth/register` | User registration | No |
| POST | `/auth/logout` | User logout | Yes |
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/refresh` | Refresh JWT token | Yes |

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products | No |
| GET | `/products/:id` | Get product by ID | No |
| GET | `/products/featured` | Get featured products | No |
| GET | `/products/category/:category` | Get products by category | No |
| GET | `/products/search?q=query` | Search products | No |

### Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/cart` | Get user cart | Yes |
| POST | `/cart/items` | Add item to cart | Yes |
| PUT | `/cart/items/:id` | Update cart item | Yes |
| DELETE | `/cart/items/:id` | Remove cart item | Yes |
| DELETE | `/cart` | Clear cart | Yes |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Create order | Yes |
| GET | `/orders` | Get user orders | Yes |
| GET | `/orders/:id` | Get order by ID | Yes |
| PUT | `/orders/:id/cancel` | Cancel order | Yes |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get user profile | Yes |
| PUT | `/users/profile` | Update user profile | Yes |
| PUT | `/users/password` | Change password | Yes |
| POST | `/users/avatar` | Upload avatar | Yes |

## Testing API Integration

### Manual Testing

1. **Use Browser DevTools**:
   - Network tab to see requests/responses
   - Console for error messages

2. **Test with Postman/Insomnia**:
   - Test API endpoints independently
   - Verify request/response formats

3. **Mock API Responses** (development):

```typescript
// services/mockApi.ts
export const mockProductService = {
  getAll: async (): Promise<Product[]> => {
    return Promise.resolve([
      { id: 1, name: 'Product 1', price: 99.99 },
      { id: 2, name: 'Product 2', price: 149.99 },
    ]);
  },
};

// Use in development
const productService = import.meta.env.DEV 
  ? mockProductService 
  : realProductService;
```

### Integration Testing

Example with MSW (Mock Service Worker):

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/products', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, name: 'Product 1', price: 99.99 },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Best Practices

1. **Type Safety**: Always type API responses
2. **Error Handling**: Use try-catch and handle errors gracefully
3. **Loading States**: Show loading indicators during API calls
4. **Retry Logic**: Implement retry for failed requests
5. **Caching**: Cache responses when appropriate
6. **Optimistic Updates**: Update UI before API confirms (for better UX)
7. **Debouncing**: Debounce search/filter API calls
8. **Request Cancellation**: Cancel pending requests on unmount

## Next Steps

- [Frontend Setup Guide](FRONTEND_SETUP.md) - Initial setup
- [Frontend Docker Guide](FRONTEND_DOCKER.md) - Docker usage
- [Development Guide](DEVELOPMENT_GUIDE.md) - Development workflow

## Support

For API integration issues:
- Check browser console for errors
- Verify backend is running
- Review CORS configuration
- Check environment variables
- Test API endpoints with Postman
