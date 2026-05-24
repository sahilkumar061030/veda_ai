const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  isFormData?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('vedaai_token');
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, isFormData = false } = options;
    const token = this.getToken();

    const fetchHeaders: Record<string, string> = {
      ...headers,
    };

    if (token) {
      fetchHeaders['Authorization'] = `Bearer ${token}`;
    }

    if (!isFormData) {
      fetchHeaders['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      method,
      headers: fetchHeaders,
      credentials: 'include',
    };

    if (body) {
      config.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async register(data: { name: string; email: string; password: string; institution: string }) {
    return this.request<{ message: string; token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: data,
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ message: string; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: data,
    });
  }

  async getMe() {
    return this.request<{ user: any }>('/auth/me');
  }

  // Assignments
  async getAssignments(params?: { page?: number; limit?: number; status?: string; search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return this.request<{ assignments: any[]; pagination: any }>(`/assignments${query ? `?${query}` : ''}`);
  }

  async getAssignment(id: string) {
    return this.request<{ assignment: any }>(`/assignments/${id}`);
  }

  async createAssignment(formData: FormData) {
    return this.request<{ message: string; assignment: any }>('/assignments', {
      method: 'POST',
      body: formData,
      isFormData: true,
    });
  }

  async regenerateAssignment(id: string) {
    return this.request<{ message: string; assignment: any }>(`/assignments/${id}/regenerate`, {
      method: 'POST',
    });
  }

  async deleteAssignment(id: string) {
    return this.request<{ message: string }>(`/assignments/${id}`, {
      method: 'DELETE',
    });
  }

  async getStats() {
    return this.request<{ stats: any; recentActivity: any[] }>('/assignments/stats');
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
