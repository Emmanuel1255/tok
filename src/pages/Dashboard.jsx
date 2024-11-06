import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  PencilSquareIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  PlusIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { stripHtmlAndLimitWords } from '../utils/textHelpers';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}` || 'http://localhost:5000/api';

// Helper function to get activity icon based on type
const ActivityIcon = ({ type }) => {
  switch (type) {
    case 'post_created':
      return <PencilSquareIcon className="h-5 w-5 text-green-600" />;
    case 'post_updated':
      return <PencilIcon className="h-5 w-5 text-blue-600" />;
    case 'post_deleted':
      return <TrashIcon className="h-5 w-5 text-red-600" />;
    case 'comment_added':
    case 'comment_received':
      return <ChatBubbleLeftIcon className="h-5 w-5 text-purple-600" />;
    case 'like_given':
    case 'like_received':
      return <HeartIcon className="h-5 w-5 text-pink-600" />;
    default:
      return <DocumentTextIcon className="h-5 w-5 text-gray-600" />;
  }
};

// Helper function to format relative time
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

export default function Dashboard() {
  const { user, token } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    overview: {
      totalPosts: 0,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      engagementRate: '0'
    },
    postsByStatus: {
      published: 0,
      draft: 0
    },
    recentEngagement: {
      last30Days: {
        views: 0,
        likes: 0,
        comments: 0
      }
    }
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [statsRes, postsRes, activitiesRes] = await Promise.all([
          axios.get(`${API_URL}/users/stats`, config),
          axios.get(`${API_URL}/posts/me/posts?limit=5`, config),
          axios.get(`${API_URL}/users/activities`, config)
        ]);

        setStats(statsRes.data.data);
        setRecentPosts(postsRes.data.data);
        setActivities(activitiesRes.data.data);
        
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading dashboard</h3>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statsConfig = [
    { 
      name: 'Total Posts', 
      value: stats.overview.totalPosts,
      subtext: `${stats.postsByStatus.published || 0} published`, 
      icon: DocumentTextIcon 
    },
    { 
      name: 'Total Views', 
      value: stats.overview.totalViews >= 1000 
        ? `${(stats.overview.totalViews / 1000).toFixed(1)}k` 
        : stats.overview.totalViews,
      subtext: `${stats.recentEngagement.last30Days.views} this month`, 
      icon: ChartBarIcon 
    },
    {
      name: 'Engagement Rate',
      value: `${stats.overview.engagementRate}%`,
      subtext: `${stats.overview.totalLikes + stats.overview.totalComments} interactions`,
      icon: UserGroupIcon
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Welcome back, {user?.firstName || 'User'}
            </h2>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <Link
              to="/blog/new"
              className="ml-3 inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Post
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statsConfig.map((stat) => (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className="absolute rounded-md bg-primary-500 p-3">
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
              </dt>
              <dd className="ml-16 flex flex-col gap-1">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                {stat.subtext && (
                  <p className="text-sm text-gray-500">{stat.subtext}</p>
                )}
              </dd>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Posts Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Posts</h3>
              <Link
                to="/blog/my-posts"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
            <div className="flow-root">
              {recentPosts.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No posts yet</p>
              ) : (
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentPosts.map((post) => (
                    <li key={post._id} className="py-5">
                      <div className="relative focus-within:ring-2 focus-within:ring-primary-500">
                        <h3 className="text-sm font-semibold text-gray-800">
                          <Link to={`/blog/${post._id}`} className="hover:underline focus:outline-none">
                            {post.title}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {stripHtmlAndLimitWords(post.excerpt)}
                        </p>
                        <div className="mt-2 flex items-center gap-x-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            post.status === 'published' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {post.status}
                          </span>
                          <span className="text-xs text-gray-500">{post.views} views</span>
                          <span className="text-xs text-gray-500">
                            {formatRelativeTime(post.createdAt)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <Link
                to="/dashboard/activity"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
            <div className="flow-root">
              {activities.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No recent activity</p>
              ) : (
                <ul className="-mb-8">
                  {activities.map((activity, index) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {index !== activities.length - 1 ? (
                          <span
                            className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex items-start space-x-3">
                          <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <ActivityIcon type={activity.type} />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <p className="text-sm text-gray-900">{activity.content}</p>
                              <p className="mt-0.5 text-sm text-gray-500">
                                {formatRelativeTime(activity.createdAt)}
                              </p>
                              {activity.post && (
                                <Link
                                  to={`/blog/${activity.post._id}`}
                                  className="mt-2 text-sm text-primary-600 hover:text-primary-500"
                                >
                                  View post →
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/blog/new"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
            >
              <div className="flex-shrink-0">
                <PlusIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Create New Post</p>
                <p className="text-sm text-gray-500">Start writing a new blog post</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}