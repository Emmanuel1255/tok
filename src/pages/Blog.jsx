import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentPage,
  setSelectedCategory,
  setSearchTerm,
  selectAllPosts,
  selectPostsStatus,
  selectPostsError,
  selectCurrentPage,
  selectTotalPages,
  selectFilters,
  clearFilters
} from '../features/posts/postsSlice';
import { fetchPosts } from '../features/posts/postsActions';
import PostCard from '../components/blog/PostCard';
import Button from '../components/common/Button';

const CATEGORIES = [
  'All',
  'Technology',
  'Programming',
  'Design',
  'Business',
  'Lifestyle',
];

export default function Blog() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const status = useSelector(selectPostsStatus);
  const error = useSelector(selectPostsError);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const { category, search } = useSelector(selectFilters);
  
  const [searchInput, setSearchInput] = useState(search || '');

  // Fetch posts when the component mounts or any filter changes
  useEffect(() => {
    dispatch(fetchPosts({
      page: currentPage,
      category: category === 'All' ? null : category, // Pass null for "All" to disable filtering by category
      search
    }));
  }, [dispatch, currentPage, category, search]);

  // Debounced search input handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        dispatch(setSearchTerm(searchInput));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, dispatch, search]);

  // Update selected category
  const handleCategoryChange = (newCategory) => {
    dispatch(setSelectedCategory(newCategory));
    dispatch(setCurrentPage(1)); // Reset to the first page when changing category
  };

  // Pagination handler
  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render loading state
  if (status === 'loading' && !posts.length) {
    return (
      <div className="min-h-screen bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Error Loading Posts</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <Button onClick={() => dispatch(fetchPosts())} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Latest Blog Posts
          </h1>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Discover stories, thinking, and expertise.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mt-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-center sm:gap-4">
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('');
                  dispatch(setSearchTerm(''));
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  category === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {(category !== 'All' || search) && (
            <button
              onClick={() => dispatch(clearFilters())}
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Blog Posts Grid */}
        {status === 'loading' ? (
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-100 rounded-lg h-96" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center mt-16">
            <p className="text-gray-600">No posts found. Try adjusting your search or filters.</p>
            <button
              onClick={() => dispatch(clearFilters())}
              className="mt-4 text-primary-600 hover:text-primary-500"
            >
              Clear all filters
            </button>
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
            <Button
              variant="secondary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || status === 'loading'}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "primary" : "secondary"}
                  onClick={() => handlePageChange(index + 1)}
                  disabled={status === 'loading'}
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="secondary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || status === 'loading'}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
