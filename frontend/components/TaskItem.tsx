/**
 * Task item component displaying a single task with actions.
 */

"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import type { Task } from "@/lib/types";

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, onUpdate, onEdit }: TaskItemProps) {
  const [isTogglingComplete, setIsTogglingComplete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = async () => {
    setIsTogglingComplete(true);
    try {
      await apiFetch(`/api/tasks/${task.id}/complete`, {
        method: "PATCH",
      });
      onUpdate();
      toast.success("Task updated");
    } catch (error) {
      console.error("Failed to toggle task:", error);
      toast.error("Failed to update task. Please try again.");
    } finally {
      setIsTogglingComplete(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await apiFetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });
      onUpdate();
      toast.success("Task deleted");
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task. Please try again.");
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const formattedDate = new Date(task.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={`relative bg-white rounded-xl shadow-md p-5 border-2 transition-all duration-200 hover:shadow-xl ${
        task.completed
          ? "border-transparent bg-gradient-to-br from-green-50 to-emerald-50"
          : "border-gray-100 hover:border-indigo-200"
      } ${isDeleting ? "opacity-50" : ""} ${task.completed ? "bg-gradient-to-r from-green-100/50 via-emerald-100/50 to-green-100/50 bg-[length:200%_100%] animate-gradient" : ""}`}
      style={{
        backgroundImage: task.completed
          ? "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)"
          : undefined,
      }}
    >
      {task.completed && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/10 to-emerald-400/10 pointer-events-none"></div>
      )}
      <div className="relative flex items-start space-x-4">
        <div className="flex-shrink-0 pt-0.5">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isTogglingComplete || isDeleting}
            className="h-6 w-6 text-green-600 focus:ring-green-500 border-gray-300 rounded-md cursor-pointer disabled:cursor-not-allowed transition-all duration-200 hover:scale-110"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-semibold transition-all duration-200 ${
              task.completed
                ? "line-through text-gray-500"
                : "text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`mt-2 text-sm leading-relaxed ${
                task.completed ? "text-gray-400" : "text-gray-700"
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="mt-3 flex items-center space-x-2">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs text-gray-500 font-medium">Created {formattedDate}</p>
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleEdit}
            disabled={isDeleting}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 min-h-[44px] min-w-[80px]"
          >
            <svg
              className="mr-1.5 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 min-h-[44px] min-w-[80px]"
          >
            {isDeleting ? (
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
                Deleting...
              </>
            ) : (
              <>
                <svg
                  className="mr-1.5 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
