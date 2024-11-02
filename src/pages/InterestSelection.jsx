// src/pages/InterestSelection.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlusIcon } from "lucide-react";
import api from '../api';

const DEFAULT_INTERESTS = [
  { id: 'programming', label: 'Programming' },
  { id: 'data-science', label: 'Data Science' },
  { id: 'technology', label: 'Technology' },
  { id: 'self-improvement', label: 'Self Improvement' },
  { id: 'writing', label: 'Writing' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'machine-learning', label: 'Machine Learning' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'politics', label: 'Politics' },
  { id: 'cryptocurrency', label: 'Cryptocurrency' },
  { id: 'psychology', label: 'Psychology' },
  { id: 'money', label: 'Money' },
  { id: 'business', label: 'Business' },
  { id: 'python', label: 'Python' },
  { id: 'health', label: 'Health' },
  { id: 'science', label: 'Science' },
  { id: 'mental-health', label: 'Mental Health' },
  { id: 'life', label: 'Life' },
  { id: 'software-development', label: 'Software Development' },
  { id: 'startup', label: 'Startup' },
  { id: 'design', label: 'Design' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'ai', label: 'Artificial Intelligence' },
  { id: 'culture', label: 'Culture' },
  { id: 'software-engineering', label: 'Software Engineering' },
  { id: 'blockchain', label: 'Blockchain' },
  { id: 'coding', label: 'Coding' },
  { id: 'entrepreneurship', label: 'Entrepreneurship' },
  { id: 'react', label: 'React' },
  { id: 'ux', label: 'UX' }
];

export default function InterestSelection() {
  const [selectedInterests, setSelectedInterests] = useState(new Set());
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const displayedInterests = showMore ? DEFAULT_INTERESTS : DEFAULT_INTERESTS.slice(0, 24);

  const toggleInterest = (id) => {
    setSelectedInterests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleContinue = async () => {
    if (selectedInterests.size < 3) {
      setError('Please select at least 3 interests to continue');
      return;
    }
  
    try {
      setError('');
      const interestsArray = Array.from(selectedInterests);
  
      // Use the custom api instance for the POST request
      await api.post('/users/interests', { interests: interestsArray });
  
      // Navigate to the dashboard after successful save
      navigate('/blog');
    } catch (error) {
      setError('Failed to save interests. Please try again.');
      console.error('Failed to save interests:', error);
    }
  };
  

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-16">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          What are you interested in?
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Choose three or more.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {displayedInterests.map((interest) => (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors
                ${selectedInterests.has(interest.id)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
            >
              {interest.label}
              <PlusIcon className={`ml-1 h-4 w-4 ${
                selectedInterests.has(interest.id) ? 'rotate-45' : ''
              }`} />
            </button>
          ))}
        </div>

        {!showMore && (
          <button
            onClick={() => setShowMore(true)}
            className="mt-8 text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Show more
          </button>
        )}

        <button
          onClick={handleContinue}
          disabled={selectedInterests.size < 3}
          className={`mt-12 w-full rounded-lg py-3 px-4 text-white transition-colors sm:w-auto sm:min-w-[200px]
            ${selectedInterests.size >= 3
              ? 'bg-primary-600 hover:bg-primary-500'
              : 'bg-gray-300 cursor-not-allowed'
            }`}
        >
          Continue
        </button>

        {error && (
          <p className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
