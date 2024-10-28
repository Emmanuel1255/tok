// src/components/blog/BlogFilters.jsx
import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function BlogFilters({ 
  categories, 
  tags, 
  selectedCategory, 
  selectedTags, 
  onCategoryChange, 
  onTagChange, 
  onSearch 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      onTagChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="bg-white">
      {/* Mobile filter dialog */}
      <div className={`relative z-40 lg:hidden ${showMobileFilters ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        
        <div className="fixed inset-0 z-40 flex">
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowMobileFilters(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Filters */}
            <div className="mt-4 px-4">
              <h3 className="text-sm font-medium text-gray-900">Categories</h3>
              <div className="mt-2 space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => onCategoryChange(e.target.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="ml-3 text-sm text-gray-600">
                      {category}
                    </label>
                  </div>
                ))}
              </div>

              <h3 className="mt-6 text-sm font-medium text-gray-900">Tags</h3>
              <div className="mt-2 space-y-2">
                {tags.map((tag) => (
                  <div key={tag} className="flex items-center">
                    <input
                      type="checkbox"
                      value={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                      className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <label className="ml-3 text-sm text-gray-600">
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop filters */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </form>

            {/* Mobile filter button */}
            <button
              type="button"
              className="inline-flex items-center lg:hidden ml-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => setShowMobileFilters(true)}
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Desktop filter options */}
          <div className="hidden lg:block">
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onCategoryChange('all')}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    selectedCategory === 'all'
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      selectedCategory === category
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Selected tags */}
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    {tag}
                    <XMarkIcon className="ml-2 h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}