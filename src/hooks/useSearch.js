// src/hooks/useSearch.js
import { useState } from 'react';
import useDebounce from './useDebounce';

export default function useSearch(onSearch, delay = 300) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  return [searchTerm, setSearchTerm];
}