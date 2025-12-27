const AUTH_ENDPOINTS = ["/api/auth/login", "/api/auth/sessions/refresh"];

function shouldInjectAuthHeaders(url?: string): boolean {
  if (!url) return false;
  return AUTH_ENDPOINTS.some((endpoint) => url === endpoint || url.endsWith(endpoint));
}

export default shouldInjectAuthHeaders;