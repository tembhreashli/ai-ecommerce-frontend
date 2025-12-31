import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductState, Product, ProductFilters } from '../types';
import * as productService from '../services/productService';
import { getErrorMessage } from '../utils/helpers';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../utils/constants';

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: DEFAULT_PAGE,
    limit: DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'product/fetchAll',
  async ({ filters, page, limit }: { 
    filters?: ProductFilters; 
    page?: number; 
    limit?: number 
  }, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(filters, page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'product/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const product = await productService.getProductById(id);
      return product;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'product/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const products = await productService.getFeaturedProducts();
      return products;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const searchProducts = createAsyncThunk(
  'product/search',
  async (query: string, { rejectWithValue }) => {
    try {
      const products = await productService.searchProducts(query);
      return products;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch product by ID
    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedProduct = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch featured products
    builder.addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });

    // Search products
    builder.addCase(searchProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(searchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
    });
    builder.addCase(searchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, setFilters, clearFilters, setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
