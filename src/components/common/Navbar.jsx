// src/components/common/Navbar.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { logout, selectAuth } from '../../features/auth/authSlice';

const publicNavigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' }
];

const privateNavigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'New Post', href: '/blog/new' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [complaintsOpen, setComplaintsOpen] = useState(false); // State for complaints dialog
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(selectAuth);

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
  };

  const navigation = [...publicNavigation, ...(isAuthenticated ? privateNavigation : [])];

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4" aria-label="Global">
        <div className="flex items-center justify-between py-6">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="text-2xl font-bold text-primary-600">Tok</span>
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600"
              >
                {item.name}
              </Link>
            ))}
            {/* Complaints Button */}
            <button
              onClick={() => setComplaintsOpen(true)}
              className="flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600"
            >
              <QuestionMarkCircleIcon className="h-5 w-5" />
              
            </button>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center gap-x-6">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-x-4">
                  <Link
                    to={`/profile/${user?.username}`}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-primary-600"
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    {user?.username || 'My Account'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-primary-600"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          {/* Mobile Menu Content */}
        </Dialog.Panel>
      </Dialog>
      
      {/* Complaints Dialog */}
      <Dialog as="div" open={complaintsOpen} onClose={() => setComplaintsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black bg-opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6">
            <Dialog.Title className="text-lg font-semibold">Submit a Complaint</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-500">
              Please describe the issue you’re experiencing, and we’ll address it as soon as possible.
            </Dialog.Description>
            <textarea
              className="mt-4 w-full border border-gray-300 rounded-md p-2"
              placeholder="Describe your complaint..."
              rows={4}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setComplaintsOpen(false)}
                className="mr-2 px-4 py-2 text-sm font-semibold text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => setComplaintsOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md hover:bg-primary-500"
              >
                Submit
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </header>
  );
}
