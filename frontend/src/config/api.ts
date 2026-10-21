/**
 * Centralized API configuration for Vite + React.
 * Uses Vite's `import.meta.env.VITE_API_URL` when deployed,
 * falling back to relative paths (or local proxy) if unset.
 */

const rawApiUrl = import.meta.env.VITE_API_URL || '';

// Clean up trailing slash to avoid double-slash issues (e.g. 'https://api.domain.com/' -> 'https://api.domain.com')
export const API_BASE_URL: string = rawApiUrl.replace(/\/+$/, '');

/**
 * Returns a fully qualified or clean relative URL for any API endpoint.
 * Example: getApiUrl('/api/auth/login') -> 'https://my-backend.onrender.com/api/auth/login' or '/api/auth/login'
 */
export const getApiUrl = (endpoint: string): string => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${normalizedEndpoint}`;
};

/**
 * WebSocket / Socket.io server URL
 */
export const SOCKET_URL: string = API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
