// src/pages/Dashboard.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  PencilSquareIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

// Mock data - replace with actual data from your API
const stats = [
  { name: 'Total Posts', value: '12', icon: DocumentTextIcon },
  { name: 'Total Views', value: '2.3k', icon: ChartBarIcon },
  { name: 'Followers', value: '148', icon: UserGroupIcon },
];

const recentPosts = [
  {
    id: 1,
    title: 'Getting Started with React and Tailwind',
    excerpt: 'Learn how to set up a new project with React and Tailwind CSS...',
    publishedAt: '2024-03-15',
    status: 'published',
    views: 234
  },
  {
    id: 2,
    title: 'Building a Blog Platform',
    excerpt: 'Step by step guide to creating your own blogging platform...',
    publishedAt: '2024-03-14',
    status: 'draft',
    views: 0
  },
  // Add more posts as needed
];

const recentActivity = [
  {
    id: 1,
    type: 'comment',
    content: 'New comment on "Getting Started with React and Tailwind"',
    timestamp: '30 minutes ago'
  },
  {
    id: 2,
    type: 'like',
    content: '5 new likes on your recent post',
    timestamp: '2 hours ago'
  },
  // Add more activities as needed
];

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Welcome back, {user?.name || 'User'}
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
          {stats.map((stat) => (
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
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
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
              <ul className="-my-5 divide-y divide-gray-200">
                {recentPosts.map((post) => (
                  <li key={post.id} className="py-5">
                    <div className="relative focus-within:ring-2 focus-within:ring-primary-500">
                      <h3 className="text-sm font-semibold text-gray-800">
                        <Link to={`/blog/${post.id}`} className="hover:underline focus:outline-none">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                      <div className="mt-2 flex items-center gap-x-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          post.status === 'published' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {post.status}
                        </span>
                        <span className="text-xs text-gray-500">{post.views} views</span>
                        <span className="text-xs text-gray-500">{post.publishedAt}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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
              <ul className="-mb-8">
                {recentActivity.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivity.length - 1 ? (
                        <span
                          className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <PencilSquareIcon className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <p className="text-sm text-gray-900">{activity.content}</p>
                            <p className="mt-0.5 text-sm text-gray-500">{activity.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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

            {/* Add more quick actions as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}