/**
 * Main tasks page displaying all user tasks.
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/AuthGuard";
import { AppLayout } from "@/components/AppLayout";
import { TaskList } from "@/components/TaskList";
import { EditTaskModal } from "@/components/EditTaskModal";
import { apiFetch } from "@/lib/api";
import type { TaskListResponse, Task } from "@/lib/types";

type FilterType = "all" | "active" | "completed";

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskListResponse["tasks"]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await apiFetch<TaskListResponse>("/api/tasks");
      setTasks(response.tasks);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = () => {
    router.push("/tasks/new");
  };

  // Filter tasks based on selected filter
  const filteredTasks = useMemo(() => {
    if (filter === "active") {
      return tasks.filter((task) => !task.completed);
    }
    if (filter === "completed") {
      return tasks.filter((task) => task.completed);
    }
    return tasks;
  }, [tasks, filter]);

  // Calculate counts for each filter
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      active: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length,
    };
  }, [tasks]);

  return (
    <AuthGuard>
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8 glass-white rounded-3xl shadow-xl p-6 sm:p-8 border border-white/50 animate-scaleIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-4xl font-bold gradient-text mb-2">
                  My Tasks
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mr-2 animate-pulse"></div>
                    <p className="text-sm font-medium text-gray-600">
                      {counts.all} {counts.all === 1 ? "task" : "tasks"} total
                    </p>
                  </div>
                  {counts.active > 0 && (
                    <>
                      <span className="text-gray-300">•</span>
                      <p className="text-sm text-gray-500">
                        {counts.active} active
                      </p>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={handleCreateTask}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 min-h-[44px]"
              >
                <svg
                  className="mr-2 h-5 w-5"
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
                Create New Task
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 animate-slideInLeft">
            <div className="glass-white rounded-2xl shadow-lg p-2 inline-flex space-x-2 border border-white/50">
              <button
                onClick={() => setFilter("all")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[44px] transform hover:scale-105 ${
                  filter === "all"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                All Tasks
                <span
                  className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    filter === "all"
                      ? "bg-white/30 text-white"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {counts.all}
                </span>
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[44px] transform hover:scale-105 ${
                  filter === "active"
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                Active
                <span
                  className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    filter === "active"
                      ? "bg-white/30 text-white"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {counts.active}
                </span>
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[44px] transform hover:scale-105 ${
                  filter === "completed"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                Completed
                <span
                  className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    filter === "completed"
                      ? "bg-white/30 text-white"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {counts.completed}
                </span>
              </button>
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

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="glass-white rounded-2xl shadow-lg p-6 border border-white/50 animate-pulse overflow-hidden relative"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
                  <div className="flex space-x-4 relative z-10">
                    <div className="h-6 w-6 bg-gradient-to-br from-purple-300 to-pink-300 rounded-md"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg w-3/4"></div>
                      <div className="h-4 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onUpdate={fetchTasks}
              onEdit={setEditingTask}
              filter={filter}
            />
          )}
        </div>

        {/* Edit Task Modal */}
        {editingTask && (
          <EditTaskModal
            task={editingTask}
            isOpen={true}
            onClose={() => setEditingTask(null)}
            onUpdate={fetchTasks}
          />
        )}
      </AppLayout>
    </AuthGuard>
  );
}
