import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {setCurrentPage, filterPosts } from '../../features/posts/postsSlice';
import { fetchPosts } from '../../features/posts/postsActions';

const BlogPostList = () => {
  const dispatch = useDispatch();
  const { posts, status, error, totalPages, currentPage, selectedCategory, selectedTags, searchTerm } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterPosts());
  }, [dispatch, currentPage, selectedCategory, selectedTags, searchTerm]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button
          onClick={() => dispatch(fetchPosts())}
          className="text-primary-600 hover:text-primary-500"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Latest Blog Posts
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Discover stories, thinking, and expertise.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col items-start justify-between">
              {/* Post content */}
            </article>
          ))}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => dispatch(setCurrentPage(Math.max(1, currentPage - 1)))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => dispatch(setCurrentPage(index + 1))}
                className={`px-4 py-2 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => dispatch(setCurrentPage(Math.min(totalPages, currentPage + 1)))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostList;