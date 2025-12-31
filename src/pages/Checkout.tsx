import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { createOrder } from '../store/orderSlice';
import { clearCart } from '../store/cartSlice';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/helpers';
import { CheckoutForm as CheckoutFormType } from '../types';
import {
  validateRequired,
  validateCardNumber,
  validateCardExpiry,
  validateCVV,
  validateZipCode,
} from '../utils/validators';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CheckoutFormType>({
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
    paymentMethod: 'Credit Card',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Validate shipping address
    if (!validateRequired(formData.shippingAddress.street)) {
      newErrors['address.street'] = 'Street address is required';
    }
    if (!validateRequired(formData.shippingAddress.city)) {
      newErrors['address.city'] = 'City is required';
    }
    if (!validateRequired(formData.shippingAddress.state)) {
      newErrors['address.state'] = 'State is required';
    }
    if (!validateZipCode(formData.shippingAddress.zipCode)) {
      newErrors['address.zipCode'] = 'Invalid zip code';
    }

    // Validate payment details
    if (formData.paymentMethod === 'Credit Card' || formData.paymentMethod === 'Debit Card') {
      if (!validateCardNumber(formData.cardNumber || '')) {
        newErrors.cardNumber = 'Invalid card number';
      }
      if (!validateCardExpiry(formData.cardExpiry || '')) {
        newErrors.cardExpiry = 'Invalid expiry date (MM/YY)';
      }
      if (!validateCVV(formData.cardCVV || '')) {
        newErrors.cardCVV = 'Invalid CVV';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await dispatch(createOrder(formData));
      await dispatch(clearCart());
      navigate('/orders');
    } catch (error) {
      console.error('Failed to create order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add items to your cart before checking out</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.shippingAddress.street}
                    onChange={handleChange}
                    className={`input ${errors['address.street'] ? 'border-red-500' : ''}`}
                  />
                  {errors['address.street'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['address.street']}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.shippingAddress.city}
                      onChange={handleChange}
                      className={`input ${errors['address.city'] ? 'border-red-500' : ''}`}
                    />
                    {errors['address.city'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['address.city']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.shippingAddress.state}
                      onChange={handleChange}
                      className={`input ${errors['address.state'] ? 'border-red-500' : ''}`}
                    />
                    {errors['address.state'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['address.state']}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code *
                    </label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.shippingAddress.zipCode}
                      onChange={handleChange}
                      className={`input ${errors['address.zipCode'] ? 'border-red-500' : ''}`}
                    />
                    {errors['address.zipCode'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['address.zipCode']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.shippingAddress.country}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                  </select>
                </div>

                {(formData.paymentMethod === 'Credit Card' ||
                  formData.paymentMethod === 'Debit Card') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        className={`input ${errors.cardNumber ? 'border-red-500' : ''}`}
                      />
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date (MM/YY) *
                        </label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          placeholder="12/25"
                          className={`input ${errors.cardExpiry ? 'border-red-500' : ''}`}
                        />
                        {errors.cardExpiry && (
                          <p className="mt-1 text-sm text-red-600">{errors.cardExpiry}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cardCVV"
                          value={formData.cardCVV}
                          onChange={handleChange}
                          placeholder="123"
                          className={`input ${errors.cardCVV ? 'border-red-500' : ''}`}
                        />
                        {errors.cardCVV && (
                          <p className="mt-1 text-sm text-red-600">{errors.cardCVV}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 border-t pt-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>{formatCurrency(total * 0.08)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-500">
                    {formatCurrency(total * 1.08)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-3 text-lg"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
