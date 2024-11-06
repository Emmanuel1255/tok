// src/components/blog/PostCard.jsx
import { useState, useEffect } from 'react';  // Add useEffect
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { getImageUrl } from '../../utils/imageUtils';
import { stripHtmlAndLimitWords } from '../../utils/textHelpers';

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');
  // const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments?.length || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // console.log(user?.id);

  const [isLiked, setIsLiked] = useState(
    post.likes?.some(likeId => likeId === user?.id)
  );

  // console.log(isLiked);

  useEffect(() => {
    if (user && post.likes) {
      // Check if user's ID exists in the likes array
      const hasLiked = post.likes.some(likeId => likeId === user.id);
      setIsLiked(hasLiked);
    }
  }, [user, post.likes]);

  const handleLike = async (e) => {
    e.preventDefault(); // Prevent navigation
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${post._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      
      

      

      if (response.data.success) {
        const newLikeStatus = !isLiked;
        setIsLiked(newLikeStatus);
        setLikesCount(prev => newLikeStatus ? prev + 1 : prev - 1);
        
        // Update the post's likes array
        if (newLikeStatus) {
          post.likes = [...(post.likes || []), user.id];
        } else {
          post.likes = post.likes.filter(likeId => likeId !== user.id);
        }
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${post._id}/comments`,
        { content: comment.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setComment('');
      setShowCommentInput(false);
      setCommentsCount(prev => prev + 1);

      // Optional: Update the post's comments array if you need to show comments
      if (post.comments) {
        post.comments.unshift(response.data.data);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageUrlAvatar = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${import.meta.env.VITE_API_BASE_URL_IMG}/uploads/avatars/${imagePath}`;
  };

  return (
    <article className="flex flex-col">
      {/* Post Image */}
      {post.featuredImage && (
        <Link to={`/blog/${post._id}`} className="relative w-full">
          <img
            src={getImageUrl(post.featuredImage) || 'https://www.webnode.com/blog/wp-content/uploads/2019/04/blog2.png'}
            alt={post.title}
            className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
            onError={(e) => {
              e.target.src = 'https://www.webnode.com/blog/wp-content/uploads/2019/04/blog2.png';
              e.target.onerror = null;
            }}
          />
        </Link>
      )}

      {/* Post Meta */}
      <div className="max-w-xl">
        <div className="mt-8 flex items-center gap-x-4 text-xs">
          <time className="text-gray-500">
            {new Date(post.updatedAt).toLocaleDateString()}
          </time>
          <Link
            to={`/blog/category/${post.category.slug}`}
            className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
          >
            {post.category.name}
          </Link>
        </div>

        {/* Post Title and Excerpt */}
        <div className="group relative">
          <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
            <Link to={`/blog/${post._id}`}>
              <span className="absolute inset-0" />
              {post.title}
            </Link>
          </h3>
          <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
            {stripHtmlAndLimitWords(post.excerpt)}
          </p>
        </div>

        {/* Author Info */}
        <div className="mt-6 flex items-center gap-x-4">
          <img
            src={getImageUrlAvatar(post.author.avatar)}
            alt={`${post.author.firstName} ${post.author.lastName}`}
            className="h-10 w-10 rounded-full bg-gray-100 object-cover"
            onError={(e) => {
              e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emmanuel';
              e.target.onerror = null;
            }}
          />
          <div className="text-sm">
            <p className="font-semibold text-gray-900">
              <Link to={`/profile/${post.author.username}`}>
                {`${post.author.firstName} ${post.author.lastName}`}
              </Link>
            </p>
            <p className="text-gray-600">{post.author.role || 'Member'}</p>
          </div>
        </div>

        {/* Interactions */}
        <div className="mt-6 flex items-center gap-x-6 border-t pt-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm ${
            isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          {isLiked ? (
            <HeartIconSolid className="h-5 w-5" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
          <span>{likesCount}</span>
        </button>

          <button
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/login');
                return;
              }
              setShowCommentInput(!showCommentInput);
            }}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-500"
          >
            <ChatBubbleLeftIcon className="h-5 w-5" />
            <span>{commentsCount}</span>
          </button>
        </div>

        {/* Comment Input */}
        {showCommentInput && isAuthenticated && (
          <form onSubmit={handleComment} className="mt-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              rows={3}
              disabled={isSubmitting}
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCommentInput(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary-600 px-3 py-1 text-sm text-white hover:bg-primary-500 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </article>
  );
}