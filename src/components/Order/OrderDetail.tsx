import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchOrderById, cancelOrder } from '../../store/orderSlice';
import { formatCurrency, formatDate } from '../../utils/helpers';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedOrder, loading, error } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  const handleCancelOrder = async () => {
    if (
      selectedOrder &&
      window.confirm('Are you sure you want to cancel this order?')
    ) {
      await dispatch(cancelOrder(selectedOrder.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'processing':
        return 'badge-info';
      case 'shipped':
        return 'badge-info';
      case 'delivered':
        return 'badge-success';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !selectedOrder) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || 'Order not found'}</p>
          <button onClick={() => navigate('/orders')} className="btn btn-primary">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const canCancelOrder =
    selectedOrder.status === 'pending' || selectedOrder.status === 'processing';

  return (
    <div className="container py-8">
      <button
        onClick={() => navigate('/orders')}
        className="mb-6 text-primary-500 hover:text-primary-600 flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Orders
      </button>

      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{selectedOrder.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-gray-600">{formatDate(selectedOrder.createdAt, 'long')}</p>
          </div>
          <span className={`badge ${getStatusColor(selectedOrder.status)}`}>
            {selectedOrder.status.toUpperCase()}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Shipping Address</h3>
            <p className="text-gray-600">
              {selectedOrder.shippingAddress.street}
              <br />
              {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
              {selectedOrder.shippingAddress.zipCode}
              <br />
              {selectedOrder.shippingAddress.country}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Payment Method</h3>
            <p className="text-gray-600">{selectedOrder.paymentMethod}</p>
            <p className="mt-2">
              Status:{' '}
              {selectedOrder.paymentStatus === 'paid' ? (
                <span className="text-green-600 font-semibold">Paid</span>
              ) : (
                <span className="text-yellow-600 font-semibold">Pending</span>
              )}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Order Summary</h3>
            <p className="text-gray-600">Items: {selectedOrder.items.length}</p>
            <p className="text-xl font-bold text-primary-500 mt-2">
              {formatCurrency(selectedOrder.total)}
            </p>
          </div>
        </div>

        {canCancelOrder && (
          <button
            onClick={handleCancelOrder}
            className="btn btn-danger"
          >
            Cancel Order
          </button>
        )}
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
        <div className="space-y-4">
          {selectedOrder.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              <img
                src={item.product.image || 'https://via.placeholder.com/100'}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-600">
                  Price: {formatCurrency(item.price)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
