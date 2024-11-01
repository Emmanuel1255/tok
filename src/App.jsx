// src/App.jsx
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from './features/auth/authSlice';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import NewBlogPost from './pages/NewBlogPost';
import EditBlogPost from './pages/EditBlogPost';
import MyPosts from './pages/MyPosts';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import InterestSelection from './pages/InterestSelection';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (user && token) {
      dispatch(setUser(user));
      dispatch(setToken(token));
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="blog">
          <Route index element={<Blog />} />
          <Route path=":id" element={<BlogPost />} />
          <Route
            path="edit/:id"
            element={
              <ProtectedRoute>
                <EditBlogPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="new"
            element={
              <ProtectedRoute>
                <NewBlogPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-posts"
            element={
              <ProtectedRoute>
                <MyPosts />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="about" element={<About />} />
        <Route path="interests" element={<InterestSelection />} />
        <Route path="profile/:username" element={<Profile />} />
        <Route
          path="edit-profile/:username"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}