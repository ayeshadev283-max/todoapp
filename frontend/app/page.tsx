/**
 * Home page - redirects to tasks if authenticated, otherwise to login.
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // User is authenticated, redirect to dashboard
        router.push("/dashboard");
      } else {
        // User is not authenticated, redirect to login
        router.push("/login");
      }
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100"></div>

      {/* Floating shapes */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="text-center relative z-10 animate-fadeIn">
        <div className="glass-white rounded-3xl shadow-2xl p-12">
          <div className="inline-flex p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 animate-float">
            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-purple-600 border-r-pink-600"></div>
          </div>
          <h2 className="mt-6 text-2xl font-bold gradient-text">TaskFlow</h2>
          <p className="mt-2 text-gray-600 font-medium">Loading your workspace...</p>
        </div>
      </div>
    </div>
  );
}
