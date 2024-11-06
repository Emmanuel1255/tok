// src/components/layout/MainLayout.jsx
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom'
import Navbar from '../common/Navbar'
import { useTheme } from '../../context/ThemeContext'

export default function MainLayout() {
  const { theme } = useTheme();

  // In your MainLayout.jsx
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <main className="container mx-auto px-4 py-8 dark:text-gray-100">
        <Outlet />
      </main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400">
          © 2024 Tok. All rights reserved.
        </div>
      </footer>
    </div>
  )
}