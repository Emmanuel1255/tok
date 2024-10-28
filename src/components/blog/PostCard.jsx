// src/components/blog/PostCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user?.id));

  const handleLike = async (e) => {
    e.preventDefault(); // Prevent navigation
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }

    try {
      // TODO: Implement like API call
      setIsLiked(!isLiked);
      // dispatch(toggleLike(post.id));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      // TODO: Implement comment API call
      // dispatch(addComment({ postId: post.id, content: comment }));
      setComment('');
      setShowCommentInput(false);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <article className="flex flex-col">
      {/* Post Image */}
      {post.image && (
        <Link to={`/blog/${post.id}`} className="relative w-full">
          <img
            src={post.image}
            alt={post.title}
            className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
          />
        </Link>
      )}
      
      {/* Post Meta */}
      <div className="max-w-xl">
        <div className="mt-8 flex items-center gap-x-4 text-xs">
          <time className="text-gray-500">
            {new Date(post.publishedAt).toLocaleDateString()}
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
            <Link to={`/blog/${post.id}`}>
              <span className="absolute inset-0" />
              {post.title}
            </Link>
          </h3>
          <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
            {post.excerpt}
          </p>
        </div>

        {/* Author Info */}
        <div className="mt-6 flex items-center gap-x-4">
          <img 
            src={post.author.avatar}
            alt={post.author.name}
            className="h-10 w-10 rounded-full bg-gray-100"
          />
          <div className="text-sm">
            <p className="font-semibold text-gray-900">
              <Link to={`/profile/${post.author.username}`}>
                {post.author.name}
              </Link>
            </p>
            <p className="text-gray-600">{post.author.role}</p>
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
            <span>{post.likesCount || 0}</span>
          </button>

          <button
            onClick={() => setShowCommentInput(!showCommentInput)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-500"
          >
            <ChatBubbleLeftIcon className="h-5 w-5" />
            <span>{post.commentsCount || 0}</span>
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
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCommentInput(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary-600 px-3 py-1 text-sm text-white hover:bg-primary-500"
              >
                Comment
              </button>
            </div>
          </form>
        )}
      </div>
    </article>
  );
}