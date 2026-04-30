// Token storage helpers
const TOKEN_KEY = 'veilvogue-token';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  // Try to get from localStorage first
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) return token;

  // Fallback to auth store (Zustand persist)
  try {
    const authStore = localStorage.getItem('veilvogue-auth');
    if (authStore) {
      const parsed = JSON.parse(authStore);
      return parsed.state?.token || null;
    }
  } catch {
    return null;
  }

  return null;
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export function getAuthHeader(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
