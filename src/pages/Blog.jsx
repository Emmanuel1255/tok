// src/pages/Blog.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  setCurrentPage,
  setSelectedCategory,
  setSelectedTags,
  setSearchTerm,
  filterPosts
} from '../features/posts/postsSlice';
import { demoBlogs } from '../data/blogPosts';
import PostCard from '../components/blog/PostCard';

export default function Blog() {
  const dispatch = useDispatch();
  const { 
    posts, 
    currentPage, 
    totalPages, 
    selectedCategory,
    searchTerm 
  } = useSelector((state) => state.posts);

  // Extract unique categories
  const categories = ['all', ...new Set(demoBlogs.map(post => post.category.name))];

  // Filter posts whenever filters change
  useEffect(() => {
    dispatch(filterPosts());
  }, [dispatch, currentPage, selectedCategory, searchTerm]);

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Latest Blog Posts
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Discover stories, thinking, and expertise.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => dispatch(setSelectedCategory(category))}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center mt-16">
            <p className="text-gray-600">No posts found. Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
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
}