/**
 * Main tasks page displaying all user tasks.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/AuthGuard';
import { Navbar } from '@/components/Navbar';
import { TaskList } from '@/components/TaskList';
import { apiFetch } from '@/lib/api';
import type { TaskListResponse } from '@/lib/types';

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskListResponse['tasks']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchTasks = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await apiFetch<TaskListResponse>('/api/tasks');
      setTasks(response.tasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = () => {
    router.push('/tasks/new');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
              <p className="mt-1 text-sm text-gray-600">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              </p>
            </div>

            <button
              onClick={handleCreateTask}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-h-[44px]"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Task
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow p-4 border border-gray-200 animate-pulse"
                >
                  <div className="flex space-x-3">
                    <div className="h-5 w-5 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <TaskList tasks={tasks} onUpdate={fetchTasks} />
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
