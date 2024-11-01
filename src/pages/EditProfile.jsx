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

  // Fetch user profile data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/profile/${username}`);
        
        // Update to match the correct data structure
        const userData = response.data.data.user;
        console.log('Fetched user data:', userData);
        setUser(userData);
        reset(userData); // Set default values in form
  
        // Set avatar preview with a fallback for missing avatar
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

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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

      const formData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.username || user.username,
        bio: data.bio,
        interests: user.interests, // Assuming interests remain the same; update if interests are editable
      };

      if (avatar) {
        formData.avatar = avatar;
      }

      // Log the data before sending
      console.log("Form Data before submission:", formData);

      // Send PUT request to updated endpoint
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/auth/updatedetails`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log("Success", response.data);

      if (response.data.success) {
        navigate(`/profile/${username}`);
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      console.error('Update profile error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">Edit Profile</h2>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

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

          <Input
            label="Bio"
            type="textarea"
            rows="4"
            {...register('bio', {
              maxLength: { value: 500, message: 'Bio cannot exceed 500 characters' },
            })}
            error={errors.bio?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">Avatar</label>
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full my-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="block w-full text-sm text-gray-500"
            />
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
