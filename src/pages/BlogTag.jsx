// src/pages/BlogTag.jsx
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchPosts } from '../features/posts/postsSlice';
import PostCard from '../components/blog/PostCard';

export default function BlogTag() {
  const { tag } = useParams();
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector((state) => state.posts);

 

  const tagTitle = tag.charAt(0).toUpperCase() + tag.slice(1);

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
        //   onClick={() => dispatch(fetchPosts())}
          className="text-primary-600 hover:text-primary-500"
        >
          Try again
        </button>
      </div>
    );
  }

  const filteredPosts = posts.filter(
    (post) => post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Posts tagged with "{tagTitle}"
          </h1>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Browse all articles tagged with {tagTitle}
          </p>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center mt-16">
            <p className="text-gray-600">No posts found with this tag.</p>
            <Link
              to="/blog"
              className="mt-4 inline-block text-primary-600 hover:text-primary-500"
            >
              ← Back to all posts
            </Link>
          </div>
        ) : (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}