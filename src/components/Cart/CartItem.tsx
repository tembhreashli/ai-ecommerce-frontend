import { CartItem as CartItemType } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../hooks/useCart';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= item.product.stock) {
      await updateCartItem(item.id, newQuantity);
    }
  };

  const handleRemove = async () => {
    await removeFromCart(item.id);
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
      <img
        src={item.product.image || 'https://via.placeholder.com/100'}
        alt={item.product.name}
        className="w-24 h-24 object-cover rounded"
      />

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{item.product.name}</h3>
        <p className="text-sm text-gray-600">{item.product.category}</p>
        <p className="text-lg font-bold text-primary-500 mt-2">
          {formatCurrency(item.price)}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="btn btn-secondary px-3 py-1"
        >
          -
        </button>
        <span className="text-lg font-semibold px-4">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={item.quantity >= item.product.stock}
          className="btn btn-secondary px-3 py-1"
        >
          +
        </button>
      </div>

      <div className="text-right">
        <p className="text-xl font-bold text-gray-900">
          {formatCurrency(item.price * item.quantity)}
        </p>
        <button
          onClick={handleRemove}
          className="mt-2 text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
