// src/features/posts/postsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { demoBlogs } from '../../data/blogPosts';

const ITEMS_PER_PAGE = 6;

const initialState = {
  posts: demoBlogs,
  status: 'idle',
  error: null,
  currentPage: 1,
  totalPages: Math.ceil(demoBlogs.length / ITEMS_PER_PAGE),
  selectedCategory: 'all',
  selectedTags: [],
  searchTerm: ''
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
    },
    setSelectedTags: (state, action) => {
      state.selectedTags = action.payload;
      state.currentPage = 1;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    filterPosts: (state) => {
      let filtered = [...demoBlogs];
      
      // Apply category filter
      if (state.selectedCategory !== 'all') {
        filtered = filtered.filter(post => 
          post.category.name.toLowerCase() === state.selectedCategory.toLowerCase()
        );
      }

      // Apply tag filter
      if (state.selectedTags.length > 0) {
        filtered = filtered.filter(post =>
          state.selectedTags.every(tag => 
            post.tags.includes(tag)
          )
        );
      }

      // Apply search filter
      if (state.searchTerm) {
        const searchLower = state.searchTerm.toLowerCase();
        filtered = filtered.filter(post =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower)
        );
      }

      // Update posts and pagination
      const startIndex = (state.currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      
      state.posts = filtered.slice(startIndex, endIndex);
      state.totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    }
  }
});

export const {
  setCurrentPage,
  setSelectedCategory,
  setSelectedTags,
  setSearchTerm,
  filterPosts
} = postsSlice.actions;

export default postsSlice.reducer;

