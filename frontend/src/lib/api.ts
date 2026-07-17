import axios from "axios";

// Get base URL from environment (Vite proxy config or direct URL)
const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true, // Crucial for Sanctum cookies
});

// Setup CSRF configuration
// Note: Sanctum requires pulling CSRF token from the base domain before logging in
export const fetchCsrfToken = async () => {
  // /sanctum/csrf-cookie is usually at the root URL (not prefixed by /api/v1)
  const rootUrl = API_URL.replace(/\/api\/v1\/?$/, "");
  await axios.get(`${rootUrl}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
};

// Response Interceptor for Unauthorized handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 419) {
      // Only redirect or trigger global events if we are not already on the login page
      // to prevent infinite loops. We dispatch a custom event.
      if (window.location.pathname !== "/login") {
        window.dispatchEvent(new Event("auth:unauthorized"));
      }
    }
    return Promise.reject(error);
  },
);
