// src/components/common/Navbar.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { logout, selectAuth } from '../../features/auth/authSlice';

const publicNavigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
];

const privateNavigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'New Post', href: '/blog/new' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(selectAuth);
  // console.log("USer", user);


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
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-2xl font-bold text-primary-600">Tok</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2">
                      <div className="flex items-center gap-2 mb-4">
                        <UserCircleIcon className="h-5 w-5" />
                        <span className="text-base font-semibold text-gray-900">
                          {user?.name || 'My Account'}
                        </span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg text-base font-semibold text-gray-900 hover:bg-gray-50"
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
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="mt-4 block rounded-md bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}