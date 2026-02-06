// API service layer - replace BASE_URL with your actual backend URL
const BASE_URL = "/api";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("auth_token");
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    logout: () => request("/auth/logout", { method: "POST" }),
  },
  dashboard: {
    stats: () => request<any>("/dashboard/stats"),
    growthChart: () => request<any[]>("/dashboard/growth"),
    verificationStatus: () => request<any>("/dashboard/verification-status"),
  },
  users: {
    list: (params?: Record<string, string>) => {
      const query = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<any>(`/users${query}`);
    },
    get: (id: string) => request<any>(`/users/${id}`),
    delete: (id: string) => request(`/users/${id}`, { method: "DELETE" }),
    exportCsv: () => request<Blob>("/users/export"),
  },
  earnings: {
    summary: (params?: Record<string, string>) => {
      const query = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<any>(`/earnings${query}`);
    },
    vendors: (params?: Record<string, string>) => {
      const query = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<any[]>(`/earnings/vendors${query}`);
    },
    trend: () => request<any[]>("/earnings/trend"),
  },
  verifications: {
    list: (params?: Record<string, string>) => {
      const query = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<any>(`/verifications${query}`);
    },
    review: (id: string, action: "approve" | "reject") =>
      request(`/verifications/${id}/${action}`, { method: "POST" }),
  },
  support: {
    tickets: (params?: Record<string, string>) => {
      const query = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<any>(`/support/tickets${query}`);
    },
    flags: (params?: Record<string, string>) => {
      const query = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<any>(`/support/flags${query}`);
    },
    deleteFlag: (id: string) => request(`/support/flags/${id}`, { method: "DELETE" }),
  },
  messages: {
    list: (filter?: string) => {
      const query = filter ? `?filter=${filter}` : "";
      return request<any[]>(`/messages${query}`);
    },
    thread: (id: string) => request<any>(`/messages/${id}`),
    send: (threadId: string, message: string) =>
      request(`/messages/${threadId}`, {
        method: "POST",
        body: JSON.stringify({ message }),
      }),
    resolve: (id: string) =>
      request(`/messages/${id}/resolve`, { method: "POST" }),
  },
  settings: {
    get: () => request<any>("/settings"),
    update: (data: any) =>
      request("/settings", { method: "PUT", body: JSON.stringify(data) }),
  },
};
