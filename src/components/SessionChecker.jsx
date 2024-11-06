// src/components/SessionChecker.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, setToken, checkSession } from '../features/auth/authSlice';

export default function SessionChecker({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSessionValidity = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      if (user && token) {
        dispatch(setUser(user));
        dispatch(setToken(token));
      } else {
        dispatch(checkSession()).catch(() => {
          navigate('/login');
        });
      }
    };

    // Initial check
    checkSessionValidity();

    // Set up interval for periodic checks
    const interval = setInterval(checkSessionValidity, 60000);

    return () => clearInterval(interval);
  }, [dispatch, navigate]);

  return children;
}