import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { OrderState, Order, CheckoutForm } from '../types';
import * as orderService from '../services/orderService';
import { getErrorMessage } from '../utils/helpers';

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

// Async thunks
export const createOrder = createAsyncThunk(
  'order/create',
  async (orderData: CheckoutForm, { rejectWithValue }) => {
    try {
      const order = await orderService.createOrder(orderData);
      return order;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'order/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await orderService.getOrders();
      return orders;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const order = await orderService.getOrderById(id);
      return order;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'order/cancel',
  async (id: string, { rejectWithValue }) => {
    try {
      const order = await orderService.cancelOrder(id);
      return order;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Create order
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.orders.unshift(action.payload);
      state.selectedOrder = action.payload;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch orders
    builder.addCase(fetchOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch order by ID
    builder.addCase(fetchOrderById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrderById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedOrder = action.payload;
    });
    builder.addCase(fetchOrderById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Cancel order
    builder.addCase(cancelOrder.fulfilled, (state, action) => {
      const index = state.orders.findIndex((order) => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.selectedOrder?.id === action.payload.id) {
        state.selectedOrder = action.payload;
      }
    });
  },
});

export const { clearError, setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
