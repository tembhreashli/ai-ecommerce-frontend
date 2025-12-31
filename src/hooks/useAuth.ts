import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { loginUser, registerUser, logoutUser } from '../store/authSlice';
import { LoginForm, RegisterForm } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  const login = async (credentials: LoginForm) => {
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      navigate('/');
    }
    return result;
  };

  const register = async (userData: RegisterForm) => {
    const result = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(result)) {
      navigate('/');
    }
    return result;
  };

  const logout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };
};
