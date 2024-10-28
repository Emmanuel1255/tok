// src/components/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom'
import Navbar from '../common/Navbar'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          © 2024 Tok. All rights reserved.
        </div>
      </footer>
    </div>
  )
}