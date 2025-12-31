import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchProductById } from '../../store/productSlice';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../hooks/useCart';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProduct, loading, error } = useSelector((state: RootState) => state.product);
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    if (selectedProduct) {
      try {
        await addToCart(selectedProduct.id, quantity);
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || 'Product not found'}</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = selectedProduct.images || [selectedProduct.image];

  return (
    <div className="container py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-primary-500 hover:text-primary-600 flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="mb-4">
            <img
              src={images[selectedImage] || 'https://via.placeholder.com/600x400'}
              alt={selectedProduct.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image || 'https://via.placeholder.com/150'}
                  alt={`${selectedProduct.name} ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  className={`w-full h-20 object-cover rounded cursor-pointer ${
                    selectedImage === index ? 'ring-2 ring-primary-500' : ''
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {selectedProduct.name}
          </h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <span className="ml-2 text-gray-700">
                {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviewCount} reviews)
              </span>
            </div>
            <span className="ml-4 badge badge-info">{selectedProduct.category}</span>
          </div>

          <div className="text-4xl font-bold text-primary-500 mb-6">
            {formatCurrency(selectedProduct.price)}
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {selectedProduct.description}
          </p>

          <div className="mb-6">
            <span
              className={`badge ${
                selectedProduct.stock > 10
                  ? 'badge-success'
                  : selectedProduct.stock > 0
                  ? 'badge-warning'
                  : 'badge-danger'
              }`}
            >
              {selectedProduct.stock > 0
                ? `${selectedProduct.stock} in stock`
                : 'Out of stock'}
            </span>
          </div>

          {selectedProduct.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="btn btn-secondary px-4 py-2"
                >
                  -
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                  className="btn btn-secondary px-4 py-2"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={selectedProduct.stock === 0 || isInCart(selectedProduct.id)}
              className="flex-1 btn btn-primary py-3 text-lg"
            >
              {selectedProduct.stock === 0
                ? 'Out of Stock'
                : isInCart(selectedProduct.id)
                ? 'Already in Cart'
                : 'Add to Cart'}
            </button>
            <button
              onClick={() => navigate('/checkout')}
              disabled={selectedProduct.stock === 0}
              className="flex-1 btn btn-secondary py-3 text-lg"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
