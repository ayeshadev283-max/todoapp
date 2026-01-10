/**
 * Create new task page.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/AuthGuard';
import { Navbar } from '@/components/Navbar';
import { TaskForm } from '@/components/TaskForm';
import { apiFetch, ApiRequestError } from '@/lib/api';
import type { TaskFormData } from '@/lib/validation';
import type { Task } from '@/lib/types';

export default function NewTaskPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const handleSubmit = async (data: TaskFormData) => {
    setError('');

    try {
      await apiFetch<Task>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: data.title,
          description: data.description || undefined,
        }),
      });

      // Redirect to tasks page on success
      router.push('/tasks');
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError('Failed to create task. Please try again.');
      }
      throw err; // Re-throw to keep form in submitting state
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
            <p className="mt-1 text-sm text-gray-600">
              Add a new task to your todo list
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="bg-white shadow rounded-lg p-6">
            <TaskForm onSubmit={handleSubmit} submitLabel="Create Task" />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
