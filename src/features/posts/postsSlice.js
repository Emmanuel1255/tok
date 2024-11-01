// src/features/posts/postsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchPosts, createPost, updatePost, deletePost } from './postsActions';

const initialState = {
  posts: [],
  status: 'idle',
  error: null,
  currentPage: 1,
  totalPages: 0,
  totalPosts: 0,
  selectedCategory: 'all',
  selectedTags: [],
  searchTerm: '',
  filters: {
    category: null,
    tags: [],
    search: ''
  }
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
      state.filters.category = action.payload === 'all' ? null : action.payload;
      state.currentPage = 1;
    },
    setSelectedTags: (state, action) => {
      state.selectedTags = action.payload;
      state.filters.tags = action.payload;
      state.currentPage = 1;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.filters.search = action.payload;
      state.currentPage = 1;
    },
    clearFilters: (state) => {
      state.selectedCategory = 'all';
      state.selectedTags = [];
      state.searchTerm = '';
      state.filters = {
        category: null,
        tags: [],
        search: ''
      };
      state.currentPage = 1;
    },
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts cases
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalPosts = action.payload.totalPosts;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create post cases
      .addCase(createPost.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts.unshift(action.payload);
        state.totalPosts += 1;
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update post cases
      .addCase(updatePost.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Delete post cases
      .addCase(deletePost.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = state.posts.filter(post => post.id !== action.payload);
        state.totalPosts -= 1;
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentPage,
  setSelectedCategory,
  setSelectedTags,
  setSearchTerm,
  clearFilters,
  resetStatus
} = postsSlice.actions;

// Selectors
export const selectAllPosts = (state) => state.posts.posts;
export const selectPostsStatus = (state) => state.posts.status;
export const selectPostsError = (state) => state.posts.error;
export const selectCurrentPage = (state) => state.posts.currentPage;
export const selectTotalPages = (state) => state.posts.totalPages;
export const selectTotalPosts = (state) => state.posts.totalPosts;
export const selectFilters = (state) => state.posts.filters;

export default postsSlice.reducer;