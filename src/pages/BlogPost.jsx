// src/pages/BlogPost.jsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  CalendarIcon, 
  UserCircleIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  PencilSquareIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

// Mock data - replace with API call
const mockPost = {
  id: 1,
  title: "Getting Started with React and Tailwind",
  content: `<p>React and Tailwind CSS are powerful tools that, when combined, can help you build beautiful and maintainable web applications quickly. This guide will walk you through setting up a new project with React and Tailwind CSS.</p>
  <h2>Setting Up Your Project</h2>
  <p>First, create a new React project using Vite...</p>
  <pre><code>npm create vite@latest my-project -- --template react</code></pre>
  <p>Then, install Tailwind CSS and its peer dependencies...</p>`,
  excerpt: "Learn how to set up a new project with React and Tailwind CSS...",
  publishedAt: "2024-03-15T10:00:00Z",
  status: "published",
  views: 234,
  comments: [
    {
      id: 1,
      content: "Great article! Very helpful for beginners.",
      author: "John Doe",
      createdAt: "2024-03-15T12:00:00Z"
    }
  ],
  likes: 45,
  author: {
    id: 1,
    name: "Emmanuel Sahr Dauda",
    bio: "Full-stack developer with a passion for React and modern web technologies",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emmanuel"
  },
  category: {
    name: "Programming",
    slug: "programming"
  },
  tags: ["React", "Tailwind CSS", "Web Development"]
};

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPost(mockPost);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load post');
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    try {
      // TODO: Implement like API call
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      // TODO: Implement comment API call
      console.log('Adding comment:', comment);
      setComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
        <Link to="/blog" className="text-primary-600 hover:text-primary-500">
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Author and Edit Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-12 w-12 rounded-full"
            />
            <div>
              <h3 className="text-sm font-medium text-gray-900">{post.author.name}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {new Date(post.publishedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          {user?.id === post.author.id && (
            <Link
              to={`/blog/edit/${post.id}`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <PencilSquareIcon className="h-4 w-4 mr-2" />
              Edit Post
            </Link>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>

        {/* Content */}
        <div 
          className="prose max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-8">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className="flex items-center text-gray-500 hover:text-primary-600"
            >
              {isLiked ? (
                <HeartIconSolid className="h-6 w-6 text-red-500" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
              <span className="ml-2">{post.likes}</span>
            </button>
            <div className="flex items-center text-gray-500">
              <ChatBubbleLeftIcon className="h-6 w-6" />
              <span className="ml-2">{post.comments.length}</span>
            </div>
            <button
              onClick={() => {
                // TODO: Implement share functionality
                navigator.clipboard.writeText(window.location.href);
              }}
              className="flex items-center text-gray-500 hover:text-primary-600"
            >
              <ShareIcon className="h-6 w-6" />
              <span className="ml-2">Share</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>
          {user ? (
            <form onSubmit={handleComment} className="mb-8">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Add a comment..."
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  Post Comment
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-md mb-8">
              <p className="text-gray-600">
                Please{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-500">
                  log in
                </Link>
                {' '}to comment.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <div className="flex-shrink-0">
                  <UserCircleIcon className="h-10 w-10 text-gray-400" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">{comment.author}</h3>
                    <time className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                  <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}