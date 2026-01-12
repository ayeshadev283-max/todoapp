/**
 * Task list component displaying multiple tasks.
 */

"use client";

import { useRouter } from "next/navigation";
import { TaskItem } from "./TaskItem";
import type { Task } from "@/lib/types";

interface TaskListProps {
  tasks: Task[];
  onUpdate: () => void;
  onEdit: (task: Task) => void;
  filter: "all" | "active" | "completed";
}

export function TaskList({ tasks, onUpdate, onEdit, filter }: TaskListProps) {
  const router = useRouter();

  if (tasks.length === 0) {
    const emptyStateConfig = {
      all: {
        title: "No tasks yet",
        description: "Get started by creating your first task!",
        gradient: "from-indigo-400 to-purple-400",
        bgGradient: "from-indigo-50 to-purple-50",
      },
      active: {
        title: "No active tasks",
        description: "All your tasks are completed. Great work!",
        gradient: "from-orange-400 to-pink-400",
        bgGradient: "from-orange-50 to-pink-50",
      },
      completed: {
        title: "No completed tasks yet",
        description: "Complete some tasks to see them here!",
        gradient: "from-green-400 to-emerald-400",
        bgGradient: "from-green-50 to-emerald-50",
      },
    };

    const config = emptyStateConfig[filter];

    return (
      <div className={`text-center py-16 bg-gradient-to-br ${config.bgGradient} rounded-2xl shadow-lg border border-gray-100`}>
        <div className="relative inline-block">
          <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-20 blur-xl rounded-full`}></div>
          <svg
            className={`relative mx-auto h-20 w-20 bg-gradient-to-br ${config.gradient} bg-clip-text text-transparent`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            style={{ stroke: 'url(#gradient)' }}
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <h3 className="mt-6 text-xl font-bold text-gray-900">{config.title}</h3>
        <p className="mt-2 text-sm text-gray-600">
          {config.description}
        </p>
        {filter === "all" && (
          <div className="mt-8">
            <button
              onClick={() => router.push("/tasks/new")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 min-h-[44px]"
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
              Create Your First Task
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onUpdate={onUpdate} onEdit={onEdit} />
      ))}
    </div>
  );
}
