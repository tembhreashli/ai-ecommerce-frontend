# Development Guide

This guide covers the development workflow, best practices, and conventions for the AI E-Commerce frontend application.

## Table of Contents

- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Component Development](#component-development)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling Guidelines](#styling-guidelines)
- [Testing](#testing)
- [Git Workflow](#git-workflow)

## Development Environment

### IDE Setup

**Recommended IDEs:**
- Visual Studio Code
- WebStorm
- Cursor

**VS Code Extensions:**
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Editor Configuration

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### Development Server

Start the dev server:
```bash
npm run dev
```

Features:
- **Hot Module Replacement (HMR)**: Changes reflect instantly
- **Fast Refresh**: Preserves component state
- **Error Overlay**: Clear error messages in browser
- **Source Maps**: Debug original TypeScript code

## Project Structure

```
src/
├── main.tsx              # Application entry point
├── App.tsx               # Root component with routing
├── components/           # Reusable UI components
│   ├── Layout/          # Layout components (Header, Footer)
│   ├── Product/         # Product-related components
│   ├── Cart/            # Shopping cart components
│   ├── Order/           # Order management components
│   ├── Auth/            # Authentication components
│   └── Common/          # Common/shared components
├── pages/               # Page components (views)
├── services/            # API services and HTTP client
├── store/               # Redux store and slices
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and helpers
└── routes/              # Routing configuration
```

### File Naming Conventions

- **Components**: PascalCase (`ProductCard.tsx`)
- **Services**: camelCase (`authService.ts`)
- **Utils**: camelCase (`formatters.ts`)
- **Types**: PascalCase or camelCase (`User.ts`, `models.ts`)
- **Hooks**: camelCase with "use" prefix (`useAuth.ts`)

## Development Workflow

### 1. Start Development

```bash
# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Install dependencies (if needed)
npm install

# Start dev server
npm run dev
```

### 2. Make Changes

- Write code following standards
- Test in browser at http://localhost:3000
- Check console for errors/warnings

### 3. Quality Checks

```bash
# Type check
npm run type-check

# Lint code
npm run lint

# Format code
npm run format

# Fix lint issues
npm run lint:fix
```

### 4. Commit Changes

```bash
# Stage changes
git add .

# Commit with meaningful message
git commit -m "feat: add product filtering feature"

# Push to remote
git push origin feature/your-feature-name
```

### 5. Create Pull Request

- Open PR on GitHub
- Add description of changes
- Request code review
- Address feedback

## Code Standards

### TypeScript

**Always use TypeScript**:
```typescript
// ✅ Good
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: 'John',
  email: 'john@example.com'
};

// ❌ Bad
const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com'
};
```

**Avoid `any` type**:
```typescript
// ✅ Good
const fetchUser = async (id: number): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

// ❌ Bad
const fetchUser = async (id: any): Promise<any> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};
```

### ESLint Rules

Our ESLint configuration enforces:
- No unused variables (warnings)
- Prefer `const` over `let`
- No `var` keyword
- Limited console usage (only `console.warn`, `console.error`)
- React Hooks rules
- TypeScript best practices

### Prettier Formatting

Code is automatically formatted with Prettier:
- Single quotes for strings
- 2-space indentation
- 100 character line width
- Semicolons enabled
- Trailing commas in ES5

Run manually:
```bash
npm run format
```

## Component Development

### Functional Components

Use functional components with hooks:

```typescript
import React, { useState, useEffect } from 'react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart({ ...product, quantity });
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};
```

### Component Structure

Follow this order:
1. Imports (external, then internal)
2. Types/Interfaces
3. Component definition
4. State hooks
5. Effect hooks
6. Custom hooks
7. Event handlers
8. Helper functions
9. Return JSX

### Props Pattern

**Named exports for components**:
```typescript
// ✅ Good
export const ProductCard: React.FC<ProductCardProps> = (props) => {
  // ...
};

// ❌ Avoid default exports for components
export default ProductCard;
```

**Destructure props**:
```typescript
// ✅ Good
const ProductCard: React.FC<Props> = ({ name, price, onAddToCart }) => {
  // ...
};

// ❌ Less readable
const ProductCard: React.FC<Props> = (props) => {
  return <div>{props.name}</div>;
};
```

### Custom Hooks

Create reusable hooks:

```typescript
// hooks/useProduct.ts
import { useState, useEffect } from 'react';
import { productService } from '@/services';
import { Product } from '@/types';

export const useProduct = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getById(id);
        setProduct(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};
```

## State Management

### Redux Toolkit

We use Redux Toolkit for global state:

**Creating a Slice**:
```typescript
// store/productSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '@/services';
import { Product } from '@/types';

interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async () => {
    const response = await productService.getAll();
    return response;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
```

**Using in Components**:
```typescript
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '@/store/productSlice';
import { RootState } from '@/store';

const ProductList = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {items.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### Local State

Use `useState` for component-local state:

```typescript
const [count, setCount] = useState(0);
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });
```

## API Integration

### Axios Instance

We use a configured Axios instance in `services/api.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT),
});

// Request interceptor (add auth token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Service Pattern

Create service files for API calls:

```typescript
// services/productService.ts
import api from './api';
import { Product } from '@/types';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await api.post<Product>('/products', product);
    return response.data;
  },

  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
```

## Styling Guidelines

### Tailwind CSS

Use Tailwind utility classes:

```tsx
<div className="container mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold text-gray-900 mb-4">
    Products
  </h1>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Product cards */}
  </div>
</div>
```

### Responsive Design

Use Tailwind breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Content */}
</div>
```

### Custom Styles

For complex styles, use CSS modules or styled components when necessary.

## Testing

### Unit Testing (Future)

When adding tests, use Jest and React Testing Library:

```typescript
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('renders product name', () => {
    const product = { id: 1, name: 'Test Product', price: 99.99 };
    render(<ProductCard product={product} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
```

### Manual Testing

Always test:
1. Component renders correctly
2. User interactions work
3. API calls succeed/fail gracefully
4. Responsive design works
5. Console has no errors

## Git Workflow

### Branch Naming

- Feature: `feature/product-filtering`
- Bug fix: `fix/cart-calculation-error`
- Hotfix: `hotfix/security-vulnerability`
- Chore: `chore/update-dependencies`

### Commit Messages

Follow conventional commits:

```
feat: add product filtering by category
fix: resolve cart total calculation issue
docs: update API integration guide
style: format code with prettier
refactor: extract product card logic to hook
test: add unit tests for cart service
chore: update dependencies
```

### Pull Request Process

1. Create feature branch
2. Make changes
3. Run quality checks
4. Commit changes
5. Push to remote
6. Open PR with description
7. Request review
8. Address feedback
9. Merge when approved

## Performance Tips

1. **Lazy Loading**: Use `React.lazy()` for route components
2. **Memoization**: Use `useMemo` and `useCallback` for expensive operations
3. **Virtual Scrolling**: For long lists
4. **Image Optimization**: Use proper formats and sizes
5. **Code Splitting**: Split large bundles

## Security Best Practices

1. **Never commit secrets**: Use environment variables
2. **Sanitize user input**: Prevent XSS
3. **Validate on backend**: Don't trust client data
4. **Use HTTPS**: In production
5. **Keep dependencies updated**: Regular security audits

## Next Steps

- [Frontend Setup Guide](FRONTEND_SETUP.md) - Initial setup
- [Frontend Docker Guide](FRONTEND_DOCKER.md) - Docker usage
- [API Integration Guide](API_INTEGRATION.md) - Backend integration

## Support

For questions or issues:
- Review [main README](README.md)
- Check existing documentation
- Create an issue in the repository
