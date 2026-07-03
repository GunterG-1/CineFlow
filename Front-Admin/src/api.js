const API_BASE_URL = process.env.REACT_APP_BFF_URL ||
  "http://localhost:4000/api";

const parseErrorMessage = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const rawText = await response.text();
  
  if (!rawText) return `HTTP ${response.status}`;

  try {
    const parsed = JSON.parse(rawText);
    return parsed?.message || parsed?.error || parsed?.detail || rawText;
  } catch {
    return rawText;
  }
};

async function request(endpoint, options = {}) {
  
  // Si el usuario pone /api/auth/login, lo limpia a /auth/login
  // para que al sumarse a API_BASE_URL no quede /api/api/
  const cleanEndpoint = endpoint.startsWith('/api') ? endpoint.substring(4) : endpoint;

  const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    const errorMessage = await parseErrorMessage(response);
    const error = new Error(errorMessage || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.status === 204 ? null : await response.json();
}

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),
  patch: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: "DELETE" }),
};