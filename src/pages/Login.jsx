// src/pages/Login.jsx
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError, selectAuth } from '../features/auth/authSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error, isAuthenticated } = useSelector(selectAuth);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  });

  // Clear any existing errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      // Clear any existing errors
      dispatch(clearError());
      
      const response = await dispatch(login(data)).unwrap();
      
      // If remember me is not checked, we could handle that here
      if (!data.remember) {
        // Could implement session-only storage instead of persistent
        // This would be handled in your backend
      }

      console.log('Login successful:', response);
    } catch (err) {
      console.error('Login failed:', err);
      // Set form-level error if it's a general error
      if (err.message) {
        setFormError('root', { 
          type: 'manual',
          message: err.message 
        });
      }
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Show either Redux error or form error */}
          {(error || errors.root) && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="text-sm text-red-700">
                  {error || errors.root?.message}
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div>
              <Input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                label="Email address"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                disabled={status === 'loading'}
              />
            </div>

            <div>
              <Input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                label="Password"
                type="password"
                autoComplete="current-password"
                error={errors.password?.message}
                disabled={status === 'loading'}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register('remember')}
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  disabled={status === 'loading'}
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className="font-medium text-primary-600 hover:text-primary-500"
                  tabIndex={status === 'loading' ? -1 : 0}
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={status === 'loading' || isSubmitting}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {/* TODO: Implement Google OAuth */}}
                disabled={status === 'loading'}
              >
                <img
                  className="mr-2 h-5 w-5"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google logo"
                />
                Google
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {/* TODO: Implement GitHub OAuth */}}
                disabled={status === 'loading'}
              >
                <img
                  className="mr-2 h-5 w-5"
                  src="https://www.svgrepo.com/show/512317/github-142.svg"
                  alt="GitHub logo"
                />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}