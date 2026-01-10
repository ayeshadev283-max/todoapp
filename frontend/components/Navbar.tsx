/**
 * Navigation bar component with user info and sign out.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Todo App
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-gray-700">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
