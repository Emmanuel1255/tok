// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useSelector } from 'react-redux';

export default function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const features = [
    {
      name: 'Easy Content Creation',
      description: 'Write and publish your stories with our intuitive editor.',
      icon: '📝',
    },
    {
      name: 'Rich Media Support',
      description: 'Embed images, videos, and other media in your posts.',
      icon: '🎨',
    },
    {
      name: 'Engage with Readers',
      description: 'Build a community with comments and reactions.',
      icon: '💬',
    },
    {
      name: 'Analytics Dashboard',
      description: 'Track your content performance and audience engagement.',
      icon: '📊',
    },
  ];

  return (
    <div className="relative isolate">
      {/* Hero section */}
      <div className="relative pt-14">
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Share your stories with the world
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Create, publish, and share your ideas with our powerful blogging platform.
                Join our community of writers and readers today.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Get started
                </Link>
                <Link
                  to="/blog"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Read blogs <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Features section */}
            <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
              <div className="mx-auto max-w-2xl lg:text-center">
                <h2 className="text-base font-semibold leading-7 text-primary-600">
                  Everything you need
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  A better way to blog
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Our platform provides all the tools you need to create and manage your blog effectively.
                </p>
              </div>
              <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                  {features.map((feature) => (
                    <div key={feature.name} className="flex flex-col">
                      <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                        <span className="text-3xl">{feature.icon}</span>
                        {feature.name}
                      </dt>
                      <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                        <p className="flex-auto">{feature.description}</p>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}