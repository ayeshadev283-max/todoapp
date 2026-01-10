/**
 * Task item component displaying a single task with actions.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiRequestError } from '@/lib/api';
import type { Task } from '@/lib/types';

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
}

export function TaskItem({ task, onUpdate }: TaskItemProps) {
  const router = useRouter();
  const [isTogglingComplete, setIsTogglingComplete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = async () => {
    setIsTogglingComplete(true);
    try {
      await apiFetch(`/api/tasks/${task.id}/complete`, {
        method: 'PATCH',
      });
      onUpdate();
    } catch (error) {
      console.error('Failed to toggle task:', error);
      alert('Failed to update task. Please try again.');
    } finally {
      setIsTogglingComplete(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await apiFetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });
      onUpdate();
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/tasks/${task.id}`);
  };

  const formattedDate = new Date(task.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={`bg-white rounded-lg shadow p-4 border ${
        task.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
      } ${isDeleting ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 pt-0.5">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isTogglingComplete || isDeleting}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-medium ${
              task.completed
                ? 'line-through text-gray-500'
                : 'text-gray-900'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`mt-1 text-sm ${
                task.completed ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {task.description}
            </p>
          )}

          <p className="mt-2 text-xs text-gray-500">
            Created {formattedDate}
          </p>
        </div>

        <div className="flex-shrink-0 flex space-x-2">
          <button
            onClick={handleEdit}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
