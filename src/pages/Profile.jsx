import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/common/Button';

export default function Profile() {
  const { username } = useParams(); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user'))?.username;

  console.log("username", username);
  console.log(currentUser === username);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/profile/${username}`);
        console.log(response.data.data.user);
        setUser(response.data.data.user);
      } catch (err) {
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-600 dark:text-red-400">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 transition-colors duration-200">
        {/* Profile Header */}
        <div className="flex items-center space-x-4">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL_IMG}/uploads/avatars/${user.avatar || 'default-avatar.jpg'}`}
            alt={`${user.username}'s avatar`}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Bio</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{user.bio || 'No bio available.'}</p>
        </div>

        {/* Interests */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Interests</h3>
          {user.interests.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 px-3 py-1 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-gray-600 dark:text-gray-400">No interests selected.</p>
          )}
        </div>

        {/* Optional Edit Button */}
        {currentUser === username && (
          <div className="mt-8">
            <Link to={`/edit-profile/${username}`}>
              <Button className="w-full sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-white">Edit Profile</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
