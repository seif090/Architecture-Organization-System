import axios from "axios";
import type { DataScope } from "./types";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api"
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export async function fetchByScope<T>(path: string, scope: DataScope) {
  const response = await api.get<T>(path, { params: { scope } });
  return response.data;
}
