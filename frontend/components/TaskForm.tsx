/**
 * Reusable task form component for create and edit operations.
 */

'use client';

import { useState, useEffect } from 'react';
import { taskSchema, type TaskFormData } from '@/lib/validation';

interface TaskFormProps {
  initialValues?: {
    title: string;
    description?: string;
  };
  onSubmit: (data: TaskFormData) => Promise<void>;
  submitLabel?: string;
}

export function TaskForm({
  initialValues,
  onSubmit,
  submitLabel = 'Save Task',
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
  });

  const [errors, setErrors] = useState<Partial<TaskFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormData({
        title: initialValues.title || '',
        description: initialValues.description || '',
      });
    }
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data with Zod
    const result = taskSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<TaskFormData> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof TaskFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(result.data);
    } catch (error) {
      // Error handling is done by the parent component
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={200}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          placeholder="Enter task title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.title.length}/200 characters
        </p>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          maxLength={1000}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          placeholder="Enter task description (optional)"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {(formData.description?.length || 0)}/1000 characters
        </p>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
