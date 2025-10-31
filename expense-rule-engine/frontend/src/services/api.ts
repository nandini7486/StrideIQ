import axios, { AxiosError } from 'axios';
import type { Rule, Action, Condition } from '@/types/rule';

interface ApiRule {
  id: string;
  name: string;
  condition: string;
  actions: string[];
  is_active: boolean;
  updated_at: string;
}

// Convert API rule to frontend rule
const toFrontendRule = (apiRule: ApiRule): Rule => ({
  ...apiRule,
  active: apiRule.is_active,
  updatedAt: apiRule.updated_at,
});

// Convert frontend rule to API rule
const toApiRule = (rule: Omit<Rule, 'id' | 'updatedAt'>): Omit<ApiRule, 'id' | 'updated_at'> => ({
  name: rule.name,
  condition: rule.condition,
  actions: rule.actions,
  is_active: rule.active,
});

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (error) {
        // Refresh token failed, redirect to login
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

// Rules API
export const fetchRules = async (): Promise<Rule[]> => {
  try {
    const response = await api.get<ApiRule[]>('/rules');
    return response.data.map(toFrontendRule);
  } catch (error) {
    console.error('Error fetching rules:', error);
    throw error;
  }
};

export const getRule = async (id: string): Promise<Rule> => {
  try {
    const response = await api.get<ApiRule>(`/rules/${id}`);
    return toFrontendRule(response.data);
  } catch (error) {
    console.error(`Error fetching rule ${id}:`, error);
    throw error;
  }
};

export const createRule = async (ruleData: Omit<Rule, 'id' | 'updatedAt'>): Promise<Rule> => {
  try {
    const apiRule = toApiRule(ruleData);
    const response = await api.post<ApiRule>('/rules', apiRule);
    return toFrontendRule(response.data);
  } catch (error) {
    console.error('Error creating rule:', error);
    throw error;
  }
};

export const updateRule = async (id: string, ruleData: Partial<Rule>): Promise<Rule> => {
  try {
    // Only include fields that can be updated
    const { id: _, updatedAt, ...updateData } = ruleData as Rule;
    const apiUpdateData: Partial<ApiRule> = {
      ...updateData,
      is_active: ruleData.active,
    };
    
    const response = await api.put<ApiRule>(`/rules/${id}`, apiUpdateData);
    return toFrontendRule(response.data);
  } catch (error) {
    console.error(`Error updating rule ${id}:`, error);
    throw error;
  }
};

export const deleteRule = async (id: string): Promise<void> => {
  try {
    await api.delete(`/rules/${id}`);
  } catch (error) {
    console.error(`Error deleting rule ${id}:`, error);
    throw error;
  }
};

// Evaluation API
export const evaluateExpense = async (expenseData: any): Promise<any> => {
  try {
    const response = await api.post('/evaluate', expenseData);
    return response.data;
  } catch (error) {
    console.error('Error evaluating expense:', error);
    throw error;
  }
};

export default api;
