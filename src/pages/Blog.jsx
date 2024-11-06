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
import { useTheme } from '../context/ThemeContext';

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
  const { theme } = useTheme();
  
  const [searchInput, setSearchInput] = useState(search || '');

  useEffect(() => {
    dispatch(fetchPosts({
      page: currentPage,
      category: category === 'All' ? null : category,
      search
    }));
  }, [dispatch, currentPage, category, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        dispatch(setSearchTerm(searchInput));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, dispatch, search]);

  const handleCategoryChange = (newCategory) => {
    dispatch(setSelectedCategory(newCategory));
    dispatch(setCurrentPage(1));
  };

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (status === 'loading' && !posts.length) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-24 sm:py-32 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 dark:border-primary-400"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-24 sm:py-32 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Error Loading Posts</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
            <Button onClick={() => dispatch(fetchPosts())} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-24 sm:py-32 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl transition-colors duration-200">
            Latest Blog Posts
          </h1>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400 transition-colors duration-200">
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
              className="w-full sm:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400 transition-colors duration-200"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('');
                  dispatch(setSearchTerm(''));
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
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
                    ? 'bg-primary-600 dark:bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {(category !== 'All' || search) && (
            <button
              onClick={() => dispatch(clearFilters())}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Blog Posts Grid */}
        {status === 'loading' ? (
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-96 transition-colors duration-200" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center mt-16">
            <p className="text-gray-600 dark:text-gray-400">No posts found. Try adjusting your search or filters.</p>
            <button
              onClick={() => dispatch(clearFilters())}
              className="mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
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
              className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
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
                  className={`dark:border-gray-700 ${
                    currentPage === index + 1 
                      ? 'dark:bg-primary-500 dark:text-white' 
                      : 'dark:bg-gray-800 dark:text-gray-200'
                  }`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="secondary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || status === 'loading'}
              className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}