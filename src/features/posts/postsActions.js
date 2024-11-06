// src/features/posts/postsActions.js
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { selectAuth } from '../auth/authSlice';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});


// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Only set Content-Type if it's not a multipart/form-data request
    if (!config.data || !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ page = 1, limit = 6, category, tags, search } = {}, { getState, rejectWithValue }) => {
    try {
      const { isAuthenticated } = selectAuth(getState());

      // Build query parameters
      const params = new URLSearchParams({
        page,
        limit,
        status: 'published',
        ...(category && category !== 'All' && { category: category.toLowerCase() }), // Pass category only if it's not 'All'
        ...(tags?.length && { tags: tags.join(',') }),
        ...(search && { search })
      });

      const response = await api.get(`/posts?${params}`);

      return {
        data: response.data.data,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        totalPosts: response.data.totalPosts
      };
    } catch (error) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Failed to fetch posts');
    }
  }
);


export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, { getState, rejectWithValue }) => {
    try {
      const response = await api.put(`/posts/${postId}/like`);
      const user = selectAuth(getState()).user;
      
      return {
        postId,
        userId: user._id,
        liked: response.data.liked // Backend should return whether post is now liked or unliked
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like post');
    }
  }
);

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, content }, { getState, rejectWithValue }) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, { content });
      return {
        postId,
        comment: response.data.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

export const editComment = createAsyncThunk(
  'posts/editComment',
  async ({ postId, commentId, content }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/posts/${postId}/comments/${commentId}`, { content });
      return {
        postId,
        commentId,
        updatedComment: response.data.data
      };
    } catch (error) {
      console.error('Edit comment error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to edit comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'posts/deleteComment',
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${postId}/comments/${commentId}`);
      return {
        postId,
        commentId
      };
    } catch (error) {
      console.error('Delete comment error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      // Create FormData
      const formData = new FormData();
      
      // Ensure title and content are properly set
      if (!postData.title || !postData.content) {
        throw new Error('Title and content are required');
      }

      // Manually append each field
      formData.append('title', postData.title);
      formData.append('content', postData.content);

      // Add category if exists
      if (postData.category) {
        formData.append('category', JSON.stringify(postData.category));
      }

      // Add tags if they exist
      if (postData.tags && postData.tags.length > 0) {
        postData.tags.forEach(tag => {
          formData.append('tags[]', tag);
        });
      }

      // Add other optional fields
      if (postData.excerpt) {
        formData.append('excerpt', postData.excerpt);
      }

      if (postData.status) {
        formData.append('status', postData.status);
      }

      // Add featured image if exists
      if (postData.featuredImage) {
        formData.append('featuredImage', postData.featuredImage);
      }

      // Log FormData contents
      for (let pair of formData.entries()) {
        console.log('FormData:', pair[0], ':', pair[1]);
      }

      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message || 'Failed to create post');
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      // Use createFormData helper to build FormData
      const formData = createFormData(postData);

      // Log FormData contents to verify structure
      for (let pair of formData.entries()) {
        console.log('FormData:', pair[0], ':', pair[1]);
      }

      const response = await api.put(`/posts/${id}`, formData);
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update post');
    }
  }
);


export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/posts/${postId}`);
      return response.data.data;
    } catch (error) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Failed to fetch post');
    }
  }
);

// Helper function to handle FormData creation
const createFormData = (postData) => {
  const formData = new FormData();
  
  Object.keys(postData).forEach(key => {
    if (key === 'featuredImage') {
      if (postData[key]) {
        formData.append(key, postData[key]);
      }
    } else if (key === 'tags') {
      postData[key].forEach(tag => {
        formData.append('tags[]', tag);
      });
    } else if (key === 'category') {
      // Append category as a JSON string
      formData.append(key, JSON.stringify(postData[key]));
    } else {
      formData.append(key, postData[key]);
    }
  });

  return formData;
};
