// src/pages/BlogCategory.jsx
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCategory, filterPosts } from '../features/posts/postsSlice';
import PostCard from '../components/blog/PostCard';

export default function BlogCategory() {
  const { category } = useParams();
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(setSelectedCategory(category));
    dispatch(filterPosts());
  }, [category, dispatch]);

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {categoryTitle} Articles
          </h1>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Browse all articles in the {categoryTitle} category
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center mt-16">
            <p className="text-gray-600">No posts found in this category.</p>
            <Link
              to="/blog"
              className="mt-4 inline-block text-primary-600 hover:text-primary-500"
            >
              ← Back to all posts
            </Link>
          </div>
        ) : (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}