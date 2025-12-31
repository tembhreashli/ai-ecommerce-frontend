import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="card hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.image || 'https://via.placeholder.com/300x200'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.featured && (
          <span className="absolute top-2 right-2 badge badge-warning">Featured</span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary-500">
            {formatCurrency(product.price)}
          </span>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="ml-1 text-sm text-gray-600">
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isInCart(product.id)}
          className={`w-full btn ${
            isInCart(product.id) ? 'btn-secondary' : 'btn-primary'
          }`}
        >
          {product.stock === 0
            ? 'Out of Stock'
            : isInCart(product.id)
            ? 'In Cart'
            : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
