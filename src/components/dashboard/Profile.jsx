// src/components/dashboard/Profile.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import Input from '../common/Input';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      // TODO: Implement profile update
      console.log('Profile update:', data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
        <Button
          variant={isEditing ? "secondary" : "primary"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />

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

          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              {...register('bio')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Name</h4>
            <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Email</h4>
            <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Bio</h4>
            <p className="mt-1 text-sm text-gray-900">{user?.bio || 'No bio provided'}</p>
          </div>
        </div>
      )}
    </div>
  );
}