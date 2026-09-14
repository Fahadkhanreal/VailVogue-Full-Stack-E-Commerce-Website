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

  // Clear memory cache (useful when data is created/updated/deleted)
  public clearCache(): void {
    this.cache.clear();
  }

  // Get data synchronously from cache if valid
  public getCached<T>(endpoint: string): T | null {
    const cached = this.cache.get(endpoint);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.data as T;
    }
    return null;
  }

  // Manually pre-seed cache (e.g. from product lists)
  public setCache<T>(endpoint: string, data: T): void {
    this.cache.set(endpoint, {
      data,
      timestamp: Date.now(),
    });
  }

  async get<T>(endpoint: string, includeAuth: boolean = false, forceRefresh: boolean = false): Promise<T> {
    // Only use memory cache for public, unauthenticated GET requests
    if (!includeAuth && !forceRefresh) {
      const cached = this.getCached<T>(endpoint);
      if (cached !== null) {
        return cached;
      }
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(includeAuth),
      cache: includeAuth ? 'no-store' : 'default',
    });

    const data = await this.handleResponse<T>(response);

    if (!includeAuth) {
      this.cache.set(endpoint, {
        data,
        timestamp: Date.now(),
      });
    }

    return data;
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
