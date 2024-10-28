// src/components/blog/BlogSearch.jsx
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

export default function BlogSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-md border-gray-300 pl-10 pr-4 py-2 focus:border-primary-500 focus:ring-primary-500"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>
    </form>
  );
}