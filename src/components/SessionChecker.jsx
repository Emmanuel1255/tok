// src/components/SessionChecker.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkSession } from '../features/auth/authSlice';

export default function SessionChecker({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check session every minute
    const checkSessionValidity = () => {
      dispatch(checkSession()).catch(() => {
        // Redirect to login if session is expired
        navigate('/login');
      });
    };

    // Initial check
    if (isAuthenticated) {
      checkSessionValidity();
    }

    // Set up interval for periodic checks
    const interval = setInterval(checkSessionValidity, 60000);

    return () => clearInterval(interval);
  }, [dispatch, navigate, isAuthenticated]);

  return children;
}