/**
 * TypeScript type definitions for the Todo application.
 */

/**
 * User entity from backend.
 */
export interface User {
  id: string;
  email: string;
}

/**
 * Task entity from backend.
 */
export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Response from POST /api/auth/login endpoint.
 */
export interface LoginResponse {
  user_id: string;
  email: string;
  token: string;
}

/**
 * Response from POST /api/auth/signup endpoint.
 */
export interface SignupResponse {
  user_id: string;
  email: string;
  token: string;
}

/**
 * Response from GET /api/tasks endpoint.
 */
export interface TaskListResponse {
  tasks: Task[];
  total: number;
}

/**
 * Request body for POST /api/tasks.
 */
export interface TaskCreateRequest {
  title: string;
  description?: string;
}

/**
 * Request body for PUT /api/tasks/{id}.
 */
export interface TaskUpdateRequest {
  title?: string;
  description?: string;
}

/**
 * Error response from backend API.
 */
export interface ApiError {
  detail:
    | string
    | Array<{
        loc: string[];
        msg: string;
        type: string;
      }>;
}
