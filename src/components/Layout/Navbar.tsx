import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="flex items-center space-x-6">
      <Link
        to="/"
        className="text-gray-700 hover:text-primary-500 font-medium transition-colors"
      >
        Home
      </Link>
      <Link
        to="/products"
        className="text-gray-700 hover:text-primary-500 font-medium transition-colors"
      >
        Products
      </Link>

      {isAuthenticated ? (
        <>
          <Link
            to="/orders"
            className="text-gray-700 hover:text-primary-500 font-medium transition-colors"
          >
            Orders
          </Link>
          <Link
            to="/profile"
            className="text-gray-700 hover:text-primary-500 font-medium transition-colors"
          >
            {user?.name || 'Profile'}
          </Link>
          <button
            onClick={logout}
            className="text-gray-700 hover:text-red-500 font-medium transition-colors"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="text-gray-700 hover:text-primary-500 font-medium transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="btn btn-primary"
          >
            Sign Up
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
