// src/pages/About.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import axios from 'axios';

export default function About() {
  const features = [
    'Unlimited blog posts',
    'Rich text editor',
    'Image uploads',
    'Custom domains',
    'SEO optimization',
    'Analytics dashboard',
    'Comment system',
    'Social media integration',
    'Newsletter integration',
    'Mobile-friendly design',
  ];

  const team = [
    {
      name: 'Emmanuel Sahr Dauda',
      role: 'Lead Developer',
      image: '/emmanuel.jpeg',  // Replace with actual image path
      bio: 'Full-stack developer with expertise in React and Node.js',
    },
    {
      name: 'Isaac Christian Kamara',
      role: 'Backend Developer',
      image: '/issac.jpeg',  // Replace with actual image path
      bio: 'Database expert specializing in MongoDB and API development',
    },
    {
      name: 'Mohamed Saidu Bassie Turay',
      role: 'Frontend Developer',
      image: 'Mohamed.jpeg',
      bio: 'UI/UX specialist with a passion for creating beautiful user experiences',
    },
  ];

  const [stats, setStats] = useState([
    { label: 'Active users', value: '...' },
    { label: 'Blog posts published', value: '...' },
    { label: 'Countries reached', value: '...' },
    { label: 'Uptime', value: '...' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats');
        setStats(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError('Failed to load statistics');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate pt-14">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              About Our Platform
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We're building the best platform for bloggers to share their stories with the world.
              Our mission is to empower writers and content creators with powerful tools and a supportive community.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Get started
              </Link>
              <Link
                to="/contact"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Contact us <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats section */}
      

      {/* Features section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to start blogging
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform provides all the tools and features you need to create, manage, and grow your blog.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-4 lg:max-w-none lg:grid-cols-2">
              {features.map((feature) => (
                <div key={feature} className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-primary-600" />
                  <span className="ml-4 text-lg text-gray-900">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet our team</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We're a passionate team of developers and designers working to create the best blogging experience.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {team.map((person) => (
              <div key={person.name} className="flex flex-col items-center">
                <img
                  className="aspect-square w-full rounded-2xl object-cover"
                  src={person.image}
                  alt={person.name}
                />
                <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">{person.name}</h3>
                <p className="text-base leading-7 text-primary-600">{person.role}</p>
                <p className="mt-4 text-base leading-7 text-gray-600 text-center">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to start your blogging journey?
              <br />
              Join our platform today.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              Start sharing your stories with the world. Create your account now and join our growing community of writers.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started
              </Link>
              <Link
                to="/blog"
                className="text-sm font-semibold leading-6 text-white"
              >
                Read our blog <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}