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
import { ThemeToggle } from '../ThemeToggle';
import { useTheme } from '../../context/ThemeContext'; 

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
  const [complaintsOpen, setComplaintsOpen] = useState(false);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(selectAuth);
  const { theme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
  };

  const navigation = [...publicNavigation, ...(isAuthenticated ? privateNavigation : [])];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800/10 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <nav className="container mx-auto px-4" aria-label="Global">
        <div className="flex items-center justify-between py-6">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">Tok</span>
            </Link>
          </div>
          
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
              >
                {item.name}
              </Link>
            ))}
            
            <button
              onClick={() => setComplaintsOpen(true)}
              className="flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <QuestionMarkCircleIcon className="h-5 w-5" />
              Help
            </button>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center gap-x-6">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <div className="flex items-center gap-x-4">
                <Link
                  to={`/profile/${user?.username}`}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  {user?.username || 'My Account'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-primary-600 dark:bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 dark:hover:bg-primary-400 transition-colors duration-200"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dialog */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white dark:bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:ring-gray-800/10 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">Tok</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-200 dark:divide-gray-800">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {isAuthenticated ? (
                  <>
                    <Link
                      to={`/profile/${user?.username}`}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="mt-4 block rounded-md bg-primary-600 dark:bg-primary-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 dark:hover:bg-primary-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
                <div className="mt-4 flex items-center">
                  <ThemeToggle />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {theme === 'dark' ? 'Dark' : 'Light'} Mode
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Complaints Dialog */}
      <Dialog 
        as="div" 
        open={complaintsOpen} 
        onClose={() => setComplaintsOpen(false)} 
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 dark:bg-black/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Submit a Complaint
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Please describe the issue you're experiencing, and we'll address it as soon as possible.
            </Dialog.Description>
            <textarea
              className="mt-4 w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
              placeholder="Describe your complaint..."
              rows={4}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setComplaintsOpen(false)}
                className="mr-2 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => setComplaintsOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 dark:bg-primary-500 rounded-md hover:bg-primary-500 dark:hover:bg-primary-400 transition-colors duration-200"
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