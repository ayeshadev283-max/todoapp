"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { TaskForm } from "@/components/TaskForm";
import { apiFetch, ApiRequestError } from "@/lib/api";
import type { TaskFormData } from "@/lib/validation";
import type { Task } from "@/lib/types";

export function EditTaskClient({ taskId }: { taskId: string }) {
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");

  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true);
      setFetchError("");

      try {
        const response = await apiFetch<Task>(`/api/tasks/${taskId}`);
        setTask(response);
      } catch (err) {
        if (err instanceof ApiRequestError) {
          if (err.status === 404) {
            setFetchError("Task not found");
          } else if (err.status === 403) {
            setFetchError("You do not have permission to edit this task");
          } else {
            setFetchError(err.message);
          }
        } else {
          setFetchError("Failed to load task. Please try again.");
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
    setSubmitError("");

    try {
      await apiFetch<Task>(`/api/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({
          title: data.title,
          description: data.description || undefined,
        }),
      });

      toast.success("Task updated successfully");
      router.push("/tasks");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Failed to update task. Please try again.");
      }
      throw err;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 glass-white rounded-3xl shadow-xl p-6 sm:p-8 border border-white/50 animate-scaleIn">
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

      {fetchError && (
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 p-5 border border-red-200 shadow-md animate-slideInLeft">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{fetchError}</p>
              <button
                onClick={() => router.push("/tasks")}
                className="mt-2 inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to tasks
              </button>
            </div>
          </div>
        </div>
      )}

      {submitError && (
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 p-5 border border-red-200 shadow-md animate-slideInLeft">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-red-800">{submitError}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="glass-white rounded-3xl shadow-xl p-6 sm:p-8 border border-white/50 animate-pulse">
          <div className="space-y-6">
            <div>
              <div className="h-5 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg w-1/4 mb-3"></div>
              <div className="h-14 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl"></div>
            </div>
            <div>
              <div className="h-5 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg w-1/4 mb-3"></div>
              <div className="h-32 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl"></div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <div className="h-12 w-24 bg-gray-200 rounded-xl"></div>
              <div className="h-12 w-32 bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      ) : task ? (
        <div className="glass-white rounded-3xl shadow-xl p-6 sm:p-8 border border-white/50 animate-slideInLeft" style={{ animationDelay: '0.1s' }}>
          <TaskForm
            initialValues={{
              title: task.title,
              description: task.description || "",
            }}
            onSubmit={handleSubmit}
            submitLabel="Update Task"
          />
        </div>
      ) : null}
    </div>
  );
}
