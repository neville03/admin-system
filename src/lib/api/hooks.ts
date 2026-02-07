import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "../auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Helper function to get auth headers
const fetchWithAuth = async (url: string) => {
  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    // If unauthorized, the auth context will handle redirect
    if (res.status === 401 || res.status === 403) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

// Dashboard hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => fetchWithAuth(`${API_BASE}/api/dashboard/stats`),
  });
}

export function useUserGrowthData() {
  return useQuery({
    queryKey: ["user-growth"],
    queryFn: async () => fetchWithAuth(`${API_BASE}/api/dashboard/growth`),
  });
}

export function useVerificationStats() {
  return useQuery({
    queryKey: ["verification-stats"],
    queryFn: async () => fetchWithAuth(`${API_BASE}/api/dashboard/verifications`),
  });
}

// Users hooks
export function useUsers(options?: { page?: number; role?: string; search?: string; limit?: number; offset?: number }) {
  return useQuery({
    queryKey: ["users", options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.page) params.set("page", options.page.toString());
      if (options?.limit) params.set("limit", options.limit.toString());
      if (options?.role) params.set("role", options.role);
      if (options?.search) params.set("search", options.search);

      return fetchWithAuth(`${API_BASE}/api/users?${params.toString()}`);
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => fetchWithAuth(`${API_BASE}/api/users/${id}`),
    enabled: !!id,
  });
}

// Verifications hooks
export function useVerifications(options?: { status?: string }) {
  return useQuery({
    queryKey: ["verifications", options?.status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.status) params.set("status", options.status);
      return fetchWithAuth(`${API_BASE}/api/verifications?${params.toString()}`);
    },
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useVerification(id: number) {
  return useQuery({
    queryKey: ["verification", id],
    queryFn: async () => fetchWithAuth(`${API_BASE}/api/verifications/${id}`),
    enabled: !!id,
  });
}

// Support tickets hooks
export function useSupportTickets(options?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ["support-tickets", options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.status) params.set("status", options.status);
      if (options?.search) params.set("search", options.search);
      return fetchWithAuth(`${API_BASE}/api/support/tickets?${params.toString()}`);
    },
    staleTime: 1000 * 30,
  });
}

export function useSupportTicket(id: number) {
  return useQuery({
    queryKey: ["support-ticket", id],
    queryFn: async () => fetchWithAuth(`${API_BASE}/api/support/tickets/${id}`),
    enabled: !!id,
  });
}

export function useSupportTicketMessages(ticketId: number) {
  return useQuery({
    queryKey: ["support-ticket-messages", ticketId],
    queryFn: async () => fetchWithAuth(`${API_BASE}/api/support/tickets/${ticketId}/messages`),
    enabled: !!ticketId,
  });
}

export function useFlags(options?: { status?: string; reason?: string; search?: string }) {
  return useQuery({
    queryKey: ["flags", options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.status) params.set("status", options.status);
      if (options?.reason) params.set("reason", options.reason);
      if (options?.search) params.set("search", options.search);
      return fetchWithAuth(`${API_BASE}/api/support/flags?${params.toString()}`);
    },
    staleTime: 1000 * 30,
  });
}

export function useFlag(id: number) {
  return useQuery({
    queryKey: ["flag", id],
    queryFn: async () => fetchWithAuth(`${API_BASE}/api/support/flags/${id}`),
    enabled: !!id,
  });
}

// Earnings hooks
export function useEarningsStats() {
  return useQuery({
    queryKey: ["earnings-stats"],
    queryFn: async () => fetchWithAuth(`${API_BASE}/api/earnings/stats`),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useEarningsChart(months = 12) {
  return useQuery({
    queryKey: ["earnings-chart", months],
    queryFn: async () => fetchWithAuth(`${API_BASE}/api/earnings/chart?months=${months}`),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useEarningsVendors(options?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ["earnings-vendors", options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.page) params.set("page", options.page.toString());
      if (options?.limit) params.set("limit", options.limit.toString());
      if (options?.search) params.set("search", options.search);
      return fetchWithAuth(`${API_BASE}/api/earnings/vendors?${params.toString()}`);
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

// Settings hooks
export function useGeneralSettings() {
  return useQuery({
    queryKey: ["settings-general"],
    queryFn: async () => fetchWithAuth(`${API_BASE}/api/settings/general`),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ["settings-team"],
    queryFn: async () => fetchWithAuth(`${API_BASE}/api/settings/team`),
    staleTime: 1000 * 60,
  });
}

export function useRoles() {
  return useQuery({
    queryKey: ["settings-roles"],
    queryFn: async () => fetchWithAuth(`${API_BASE}/api/settings/roles`),
    staleTime: 1000 * 60,
  });
}

export function usePaymentSettings() {
  return useQuery({
    queryKey: ["settings-payments"],
    queryFn: async () => fetchWithAuth(`${API_BASE}/api/settings/payments`),
    staleTime: 1000 * 60,
  });
}

export function useAuditLogs(options?: { page?: number; limit?: number; userId?: string }) {
  return useQuery({
    queryKey: ["settings-audit-logs", options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.page) params.set("page", options.page.toString());
      if (options?.limit) params.set("limit", options.limit.toString());
      if (options?.userId) params.set("userId", options.userId);
      return fetchWithAuth(`${API_BASE}/api/settings/audit-logs?${params.toString()}`);
    },
    staleTime: 1000 * 30,
  });
}

// Mutation helper
export async function updateSettings(endpoint: string, data: unknown) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to update settings");
  }
  return res.json();
}
