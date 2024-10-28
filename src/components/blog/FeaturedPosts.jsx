// src/components/blog/FeaturedPosts.jsx
import { Link } from 'react-router-dom';

export default function FeaturedPosts({ posts }) {
  if (!posts || posts.length === 0) return null;

  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1, 3);

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Featured Posts
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          The latest insights and stories from our blog
        </p>
      </div>
      
      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <article className="flex flex-col items-start justify-between lg:col-span-2">
          <Link to={`/blog/${featuredPost.slug}`} className="group relative w-full">
            <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mt-8">
              {featuredPost.category && (
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    {featuredPost.category.name}
                  </span>
                </div>
              )}
              <h3 className="text-3xl font-bold text-gray-900 group-hover:text-primary-600">
                {featuredPost.title}
              </h3>
              <p className="mt-4 text-lg text-gray-600">{featuredPost.excerpt}</p>
            </div>
          </Link>
        </article>

        <div className="flex flex-col gap-y-8">
          {secondaryPosts.map((post) => (
            <article key={post.id} className="flex flex-col items-start justify-between">
              <Link to={`/blog/${post.slug}`} className="group relative w-full">
                <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4">
                  {post.category && (
                    <div className="mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {post.category.name}
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}