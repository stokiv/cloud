export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.stokiv.com/api/v1";

interface FetchOptions extends RequestInit {
  token?: string;
}

/**
 * Standardized API client that handles authentication and JSON parsing.
 */
export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const token = options.token || (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // If 401 Unauthorized, we might want to clear token and redirect to login, 
    // but we will let the useAuth hook or SWR interceptor handle the redirect logic.
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}
