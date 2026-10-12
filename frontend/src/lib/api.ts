import { getAuthToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Custom API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// API client with authentication, in-memory caching and error handling
class ApiClient {
  private baseURL: string;
  private cache = new Map<string, CacheItem<any>>();
  private readonly CACHE_TTL_MS = 60 * 1000; // 60 seconds memory cache

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorData;

      try {
        errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use status text
      }

      throw new ApiError(errorMessage, response.status, errorData);
    }

    return response.json();
  }

  // Clear memory and storage cache
  public clearCache(): void {
    this.cache.clear();
    if (typeof window !== 'undefined') {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('vv_cache_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch {
        // Ignore localStorage errors
      }
    }
  }

  // Get data synchronously from memory or persistent localStorage cache
  public getCached<T>(endpoint: string): T | null {
    // 1. Check in-memory cache first
    const cached = this.cache.get(endpoint);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.data as T;
    }

    // 2. Check localStorage persistent cache (allows instant 0ms loads across refreshes)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`vv_cache_${endpoint}`);
        if (stored) {
          const parsed: CacheItem<T> = JSON.parse(stored);
          // Keep stale cache valid for up to 24 hours to prevent blank screen while sleeping
          if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
            this.cache.set(endpoint, parsed);
            return parsed.data;
          }
        }
      } catch {
        // Private mode or storage quota error
      }
    }

    return null;
  }

  // Manually pre-seed cache (both memory and localStorage)
  public setCache<T>(endpoint: string, data: T): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };
    this.cache.set(endpoint, item);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`vv_cache_${endpoint}`, JSON.stringify(item));
      } catch {
        // Ignore quota errors
      }
    }
  }

  async get<T>(endpoint: string, includeAuth: boolean = false, forceRefresh: boolean = false): Promise<T> {
    // Only use persistent cache for public, unauthenticated GET requests
    if (!includeAuth && !forceRefresh) {
      const cached = this.getCached<T>(endpoint);
      if (cached !== null) {
        // If fresh in memory (less than 1 minute old), return immediately
        const mem = this.cache.get(endpoint);
        if (mem && Date.now() - mem.timestamp < this.CACHE_TTL_MS) {
          return cached;
        }
      }
    }

    // Set a 20-second timeout so requests don't hang indefinitely
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 20000) : null;

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(includeAuth),
        cache: includeAuth ? 'no-store' : 'default',
        signal: controller?.signal,
      });

      const data = await this.handleResponse<T>(response);

      if (!includeAuth) {
        this.setCache(endpoint, data);
      }

      return data;
    } catch (err: any) {
      // If network fails or times out, return cached data if available
      const fallbackCached = this.getCached<T>(endpoint);
      if (fallbackCached !== null) {
        console.warn(`⚠️ Network failed for ${endpoint}, using cached data.`);
        return fallbackCached;
      }
      throw err;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  async post<T>(endpoint: string, data: any, includeAuth: boolean = false): Promise<T> {
    this.clearCache();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(includeAuth),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data: any, includeAuth: boolean = false): Promise<T> {
    this.clearCache();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(includeAuth),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, includeAuth: boolean = false): Promise<T> {
    this.clearCache();
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(includeAuth),
    });

    return this.handleResponse<T>(response);
  }
}

export const api = new ApiClient(API_BASE_URL);
