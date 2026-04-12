export type Role = "admin" | "project_manager" | "accountant" | "engineer" | "viewer";

export type DataScope = "all" | "demo" | "real";

export interface JwtPayload {
  userId: number;
  role: Role;
  name: string;
}
