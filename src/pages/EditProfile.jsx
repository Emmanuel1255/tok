import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { username } = useParams();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/profile/${username}`);
        const userData = response.data.data.user;
        console.log('Fetched user data:', userData);
        setUser(userData);
        reset(userData);

        setAvatarPreview(
          userData.avatar 
            ? `${import.meta.env.VITE_API_BASE_URL_IMG}/uploads/${userData.avatar}`
            : 'default-avatar.jpg'
        );
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load profile. Please try again.');
      }
    };

    fetchUser();
  }, [reset, username]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG, or GIF)');
        return;
      }

      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');

      // Create FormData object
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('username', data.username || user.username);
      formData.append('bio', data.bio || '');
      
      // Append interests if they exist
      if (user.interests && Array.isArray(user.interests)) {
        user.interests.forEach(interest => {
          formData.append('interests[]', interest);
        });
      }

      // Append avatar if a new one was selected
      if (avatar) {
        formData.append('avatar', avatar);
      }

      // Log FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/auth/updatedetails`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log("Profile update response:", response.data);

      if (response.data.success) {
        navigate(`/profile/${username}`);
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">Edit Profile</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="First Name"
              {...register('firstName', { required: 'First name is required' })}
              error={errors.firstName?.message}
            />
            <Input
              label="Last Name"
              {...register('lastName', { required: 'Last name is required' })}
              error={errors.lastName?.message}
            />
          </div>

          <Input
            label="Email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              {...register('bio')}
              rows="4"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Tell us about yourself..."
            />
            {errors.bio && <p className="text-sm text-red-600">{errors.bio.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Avatar</label>
            {avatarPreview && (
              <div className="relative w-24 h-24">
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleAvatarChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            <p className="text-xs text-gray-500">
              Accepted formats: JPEG, PNG, GIF. Max size: 5MB
            </p>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
          >
            {isLoading ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
}