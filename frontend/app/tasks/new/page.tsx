/**
 * Create new task page.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AuthGuard } from "@/components/AuthGuard";
import { AppLayout } from "@/components/AppLayout";
import { TaskForm } from "@/components/TaskForm";
import { apiFetch, ApiRequestError } from "@/lib/api";
import type { TaskFormData } from "@/lib/validation";
import type { Task } from "@/lib/types";

export default function NewTaskPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const handleSubmit = async (data: TaskFormData) => {
    setError("");

    try {
      await apiFetch<Task>("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: data.title,
          description: data.description || undefined,
        }),
      });

      // Show success message and redirect
      toast.success("Task created successfully");
      router.push("/tasks");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("Failed to create task. Please try again.");
      }
      throw err; // Re-throw to keep form in submitting state
    }
  };

  return (
    <AuthGuard>
      <AppLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8 glass-white rounded-3xl shadow-xl p-6 sm:p-8 border border-white/50 animate-scaleIn">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold gradient-text">
                  Create New Task
                </h2>
                <p className="mt-1 text-sm text-gray-600 font-medium">
                  Add a new task to stay organized and productive
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 p-5 border border-red-200 shadow-md animate-slideInLeft">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}

          <div className="glass-white rounded-3xl shadow-xl p-6 sm:p-8 border border-white/50 animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
            <TaskForm onSubmit={handleSubmit} submitLabel="Create Task" />
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
