// src/pages/NewBlogPost.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { createPost } from '../features/posts/postsActions';

const CATEGORIES = [
  'Technology',
  'Programming',
  'Design',
  'Business',
  'Lifestyle',
  'Other'
];

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'blockquote', 'code-block',
  'list', 'bullet',
  'link', 'image',
  'align',
  'color', 'background'
];

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image'],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ],
};

export default function NewBlogPost() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [status, setStatus] = useState('draft');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (1MB = 1024 * 1024 bytes)
      if (file.size > 1024 * 1024) {
        setError('Image size should be less than 1MB');
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, PNG, and GIF images are allowed');
        return;
      }

      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setError(''); // Clear any existing errors
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      if (tags.length >= 5) {
        setError('Maximum 5 tags allowed');
        return;
      }
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
      setError('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    if (!category) {
      setError('Category is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // Create category object
      const categoryObject = {
        name: category,
        slug: category.toLowerCase().replace(/\s+/g, '-')
      };

      // Create post data object (not FormData yet)
      const postData = {
        title: title.trim(),
        content: content.trim(),
        category: categoryObject,
        tags,
        status,
        excerpt: excerpt.trim(),
        featuredImage
      };

      // Log the data being sent
      console.log('Submitting post data:', postData);
      // Add this right before the dispatch in handleSubmit
      console.log('Final form data:', {
        title: title.trim(),
        content: content.trim(),
        category: categoryObject,
        tags,
        status,
        excerpt: excerpt.trim(),
        featuredImage: featuredImage ? featuredImage.name : null
      });

      // Dispatch create post action
      const result = await dispatch(createPost(postData)).unwrap();

      if (result.success) {
        navigate(`/blog/${result.data._id}`);
      } else {
        setError(result.message || 'Failed to create post');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to create post');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if form is valid
  const isFormValid = title.trim() && content.trim() && category;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
              <p className="mt-1 text-sm text-gray-600">
                Share your thoughts with the world
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                disabled={isSubmitting}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm ${isFormValid && !isSubmitting
                  ? 'bg-primary-600 hover:bg-primary-500'
                  : 'bg-gray-400 cursor-not-allowed'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Post...
                  </>
                ) : (
                  'Create Post'
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post title"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 text-3xl font-bold"
                  disabled={isSubmitting}
                  maxLength={200}
                />
                <p className="mt-2 text-sm text-gray-500">
                  {title.length}/200 characters
                </p>
              </div>

              {/* Editor */}
              <div className="prose max-w-none">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={(value) => {
                    console.log('Content changed:', value);
                    setContent(value);
                  }}
                  formats={formats}
                  modules={modules}
                  className="min-h-[300px]"
                  readOnly={isSubmitting}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Featured Image */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Image</h3>
                <div className="space-y-4">
                  {previewImage && (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFeaturedImage(null);
                          setPreviewImage('');
                        }}
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                      >
                        <XMarkIcon className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  )}
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <PlusIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                            disabled={isSubmitting}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        Maximum file size: 1MB<br />
                        Supported formats: JPEG, PNG, GIF
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Category</h3>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  disabled={isSubmitting}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Tags ({tags.length}/5)
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          disabled={isSubmitting}
                          className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:bg-primary-500 focus:text-white focus:outline-none"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Add a tag"
                      className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      disabled={isSubmitting || tags.length >= 5}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag(e);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      disabled={isSubmitting || tags.length >= 5}
                      className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 hover:bg-gray-100"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Excerpt</h3>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  placeholder="Write a brief excerpt (optional)"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  disabled={isSubmitting}
                  maxLength={500}
                />
                <p className="mt-2 text-sm text-gray-500">
                  {excerpt.length}/500 characters
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Submit Button */}
          <div className="lg:hidden">
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`w-full inline-flex justify-center items-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm ${isFormValid && !isSubmitting
                ? 'bg-primary-600 hover:bg-primary-500'
                : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Post...
                </>
              ) : (
                'Create Post'
              )}
            </button>
          </div>

          {/* Form Requirements */}
          <div className="text-sm text-gray-500 mt-8">
            <h4 className="font-medium text-gray-700">Requirements:</h4>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li className={title.trim() ? 'text-green-600' : ''}>
                Title is required
              </li>
              <li className={content.trim() ? 'text-green-600' : ''}>
                Content is required
              </li>
              <li className={category ? 'text-green-600' : ''}>
                Category is required
              </li>
              <li>Featured image is optional (max 1MB)</li>
              <li>Maximum 5 tags allowed</li>
              <li>Excerpt is optional (max 500 characters)</li>
            </ul>
          </div>

          {/* Confirmation Dialog */}
          {isSubmitting && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-center text-gray-900 font-medium">
                  Creating your post...
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

