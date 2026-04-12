export type Role = "admin" | "project_manager" | "accountant" | "engineer" | "viewer";

export type DataScope = "all" | "demo" | "real";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}
