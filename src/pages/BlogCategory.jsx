import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentPage,
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

const POSTS_PER_PAGE = 6;

export default function BlogCategory() {
  const { category } = useParams();
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const status = useSelector(selectPostsStatus);
  const error = useSelector(selectPostsError);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const { search } = useSelector(selectFilters);
  
  const [searchInput, setSearchInput] = useState(search || '');

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  useEffect(() => {
    return () => {
      dispatch(clearFilters());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPosts({
      page: currentPage,
      limit: POSTS_PER_PAGE,
      category: categoryTitle,
      search
    }));
  }, [dispatch, currentPage, categoryTitle, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        dispatch(setSearchTerm(searchInput));
        dispatch(setCurrentPage(1));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, dispatch, search]);

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
            <Button 
              onClick={() => dispatch(fetchPosts({
                page: 1,
                limit: POSTS_PER_PAGE,
                category: categoryTitle
              }))} 
              className="mt-4"
            >
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
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Link 
              to="/blog"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
            >
              ← Back to all posts
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            {categoryTitle} Posts
          </h1>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Browse our collection of {categoryTitle.toLowerCase()} articles
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder={`Search ${categoryTitle.toLowerCase()} posts...`}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 transition-colors duration-200"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('');
                  dispatch(setSearchTerm(''));
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {status === 'loading' ? (
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(POSTS_PER_PAGE)].map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-96" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center mt-16">
            <p className="text-gray-600 dark:text-gray-400">No posts found in this category.</p>
            {search && (
              <button
                onClick={() => {
                  setSearchInput('');
                  dispatch(setSearchTerm(''));
                }}
                className="mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

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
