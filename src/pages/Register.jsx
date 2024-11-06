// src/pages/Register.jsx
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser, clearError, selectAuth } from '../features/auth/authSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error, isAuthenticated } = useSelector(selectAuth);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  });

  const password = watch('password');

  // Clear any existing errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/interests');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      // Clear any existing errors
      dispatch(clearError());
      
      const response = await dispatch(registerUser(data)).unwrap();
      console.log('Registration successful:', response);
      
      // Navigation will be handled by the isAuthenticated useEffect
    } catch (err) {
      console.error('Registration failed:', err);
      setFormError('root', { 
        type: 'manual',
        message: err.message || 'Failed to register. Please try again.'
      });
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="font-medium text-primary-600 hover:text-primary-500"
            tabIndex={status === 'loading' ? -1 : 0}
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Show either Redux error or form error */}
          {(error || errors.root) && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error || errors.root?.message}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="First name"
                {...register('firstName', {
                  required: 'First name is required',
                })}
                error={errors.firstName?.message}
                disabled={status === 'loading'}
              />

              <Input
                label="Last name"
                {...register('lastName', {
                  required: 'Last name is required',
                })}
                error={errors.lastName?.message}
                disabled={status === 'loading'}
              />
            </div>

            <Input
              label="Username"
              {...register('username', {
                required: 'Username is required',
                pattern: {
                  value: /^[a-zA-Z0-9_-]+$/,
                  message: 'Username can only contain letters, numbers, underscores, and hyphens',
                },
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters long',
                },
              })}
              error={errors.username?.message}
              disabled={status === 'loading'}
            />

            <Input
              label="Email address"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={errors.email?.message}
              disabled={status === 'loading'}
            />

            <Input
              label="Password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                },
              })}
              error={errors.password?.message}
              disabled={status === 'loading'}
            />

            <Input
              label="Confirm password"
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => 
                  value === password || 'Passwords do not match',
              })}
              error={errors.confirmPassword?.message}
              disabled={status === 'loading'}
            />

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                {...register('terms', {
                  required: 'You must accept the terms and conditions',
                })}
                disabled={status === 'loading'}
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link 
                  to="/terms" 
                  className="font-medium text-primary-600 hover:text-primary-500"
                  tabIndex={status === 'loading' ? -1 : 0}
                >
                  Terms and Conditions
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="mt-2 text-sm text-red-600">{errors.terms.message}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={status === 'loading'}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Creating account...' : 'Create account'}
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