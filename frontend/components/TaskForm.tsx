/**
 * Reusable task form component for create and edit operations.
 */

"use client";

import { useState, useEffect } from "react";
import { taskSchema, type TaskFormData } from "@/lib/validation";

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
  submitLabel = "Save Task",
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialValues?.title || "",
    description: initialValues?.description || "",
  });

  const [errors, setErrors] = useState<Partial<TaskFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormData({
        title: initialValues.title || "",
        description: initialValues.description || "",
      });
    }
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data with Zod
    const result = taskSchema.safeParse(formData);

    if (!result.success) {
      const flatErrors = result.error.flatten().fieldErrors;
      const fieldErrors: Partial<TaskFormData> = {};

      if (flatErrors.title?.[0]) {
        fieldErrors.title = flatErrors.title[0];
      }
      if (flatErrors.description?.[0]) {
        fieldErrors.description = flatErrors.description[0];
      }

      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(result.data);
    } catch (error) {
      // Error handling is done by the parent component
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Task Title <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <input
            type="text"
            id="title"
            name="title"
            required
            maxLength={200}
            className={`appearance-none block w-full pl-12 pr-4 py-3.5 border ${
              errors.title ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
            } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-base`}
            placeholder="e.g., Complete project proposal"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
        {errors.title && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.title}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Make it clear and actionable
          </p>
          <p className={`text-xs font-medium ${formData.title.length > 180 ? 'text-orange-500' : 'text-gray-400'}`}>
            {formData.title.length}/200
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Description <span className="text-gray-400 text-xs font-normal">(Optional)</span>
        </label>
        <div className="relative">
          <div className="absolute top-4 left-4 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <textarea
            id="description"
            name="description"
            rows={5}
            maxLength={1000}
            className={`appearance-none block w-full pl-12 pr-4 py-3.5 border ${
              errors.description ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
            } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-base resize-none`}
            placeholder="Add more details about this task..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            disabled={isSubmitting}
          />
        </div>
        {errors.description && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.description}
          </p>
        )}
        <div className="mt-2 flex items-center justify-end">
          <p className={`text-xs font-medium ${(formData.description?.length || 0) > 900 ? 'text-orange-500' : 'text-gray-400'}`}>
            {formData.description?.length || 0}/1000
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
          className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-[44px] order-2 sm:order-1"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 min-h-[44px] order-1 sm:order-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
            <>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
