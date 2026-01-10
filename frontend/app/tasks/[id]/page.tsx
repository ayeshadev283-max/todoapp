/**
 * Edit task page with dynamic route.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthGuard } from '@/components/AuthGuard';
import { Navbar } from '@/components/Navbar';
import { TaskForm } from '@/components/TaskForm';
import { apiFetch, ApiRequestError } from '@/lib/api';
import type { TaskFormData } from '@/lib/validation';
import type { Task } from '@/lib/types';

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');

  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true);
      setFetchError('');

      try {
        const response = await apiFetch<Task>(`/api/tasks/${taskId}`);
        setTask(response);
      } catch (err) {
        if (err instanceof ApiRequestError) {
          if (err.status === 404) {
            setFetchError('Task not found');
          } else if (err.status === 403) {
            setFetchError('You do not have permission to edit this task');
          } else {
            setFetchError(err.message);
          }
        } else {
          setFetchError('Failed to load task. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const handleSubmit = async (data: TaskFormData) => {
    setSubmitError('');

    try {
      await apiFetch<Task>(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: data.title,
          description: data.description || undefined,
        }),
      });

      // Redirect to tasks page on success
      router.push('/tasks');
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setSubmitError(err.message);
      } else {
        setSubmitError('Failed to update task. Please try again.');
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
            <h2 className="text-2xl font-bold text-gray-900">Edit Task</h2>
            <p className="mt-1 text-sm text-gray-600">
              Update task details
            </p>
          </div>

          {fetchError && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{fetchError}</p>
              <button
                onClick={() => router.push('/tasks')}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Back to tasks
              </button>
            </div>
          )}

          {submitError && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{submitError}</p>
            </div>
          )}

          {isLoading ? (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : task ? (
            <div className="bg-white shadow rounded-lg p-6">
              <TaskForm
                initialValues={{
                  title: task.title,
                  description: task.description || '',
                }}
                onSubmit={handleSubmit}
                submitLabel="Update Task"
              />
            </div>
          ) : null}
        </main>
      </div>
    </AuthGuard>
  );
}
