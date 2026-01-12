"use client";

import { useState } from "react";
import { TaskForm } from "@/components/TaskForm";
import { apiFetch, ApiRequestError } from "@/lib/api";
import type { Task } from "@/lib/types";
import type { TaskFormData } from "@/lib/validation";

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function EditTaskModal({ task, isOpen, onClose, onUpdate }: EditTaskModalProps) {
  const [error, setError] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = async (data: TaskFormData) => {
    setError("");

    try {
      await apiFetch<Task>(`/api/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: data.title,
          description: data.description || undefined,
        }),
      });

      onUpdate();
      onClose();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Failed to update task. Please try again.");
      }
      throw err;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl glass-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/50 animate-scaleIn">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold gradient-text">
                  Edit Task
                </h2>
                <p className="mt-1 text-sm text-gray-600 font-medium">
                  Update your task details
                </p>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 p-5 border border-red-200 shadow-md">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <TaskForm
            initialValues={{
              title: task.title,
              description: task.description || "",
            }}
            onSubmit={handleSubmit}
            submitLabel="Update Task"
          />
        </div>
      </div>
    </div>
  );
}
