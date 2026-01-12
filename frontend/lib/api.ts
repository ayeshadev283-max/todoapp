/**
 * API client utilities for communicating with the backend.
 */

import type { ApiError } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Get the JWT token from localStorage.
 *
 * @returns JWT token or null if not found
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

/**
 * Set the JWT token in localStorage.
 *
 * @param token - JWT token to store
 */
export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_token", token);
}

/**
 * Remove the JWT token from localStorage.
 */
export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
}

/**
 * Custom error class for API errors.
 */
export class ApiRequestError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: ApiError,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

/**
 * Wrapper around fetch that automatically injects JWT token
 * and handles common error cases.
 *
 * @param endpoint - API endpoint (relative to API_BASE_URL)
 * @param options - Fetch options
 * @returns Response data
 * @throws ApiRequestError on HTTP errors
 */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    // Parse JSON response
    const data = await response.json().catch(() => null);

    // Handle error responses
    if (!response.ok) {
      throw new ApiRequestError(
        data?.detail || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        data,
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }

    // Network or other errors
    throw new ApiRequestError(
      error instanceof Error ? error.message : "Network request failed",
      0,
    );
  }
}

/**
 * API client methods for common operations.
 */
export const api = {
  /**
   * Authentication endpoints
   */
  auth: {
    signup: (email: string, password: string) =>
      apiFetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    login: (email: string, password: string) =>
      apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
  },

  /**
   * Task endpoints
   */
  tasks: {
    list: (completed?: boolean) => {
      const params = completed !== undefined ? `?completed=${completed}` : "";
      return apiFetch(`/api/tasks${params}`);
    },

    get: (id: number) => apiFetch(`/api/tasks/${id}`),

    create: (title: string, description?: string) =>
      apiFetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      }),

    update: (id: number, title?: string, description?: string) =>
      apiFetch(`/api/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title, description }),
      }),

    delete: (id: number) =>
      apiFetch(`/api/tasks/${id}`, {
        method: "DELETE",
      }),

    toggleComplete: (id: number) =>
      apiFetch(`/api/tasks/${id}/complete`, {
        method: "PATCH",
      }),
  },
};
