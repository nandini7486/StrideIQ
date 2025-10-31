import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Rules API
export const fetchRules = async () => {
  const response = await api.get('/rules');
  return response.data;
};

export const createRule = async (ruleData: any) => {
  const response = await api.post('/rules', ruleData);
  return response.data;
};

export const updateRule = async (id: string, ruleData: any) => {
  const response = await api.put(`/rules/${id}`, ruleData);
  return response.data;
};

export const deleteRule = async (id: string) => {
  const response = await api.delete(`/rules/${id}`);
  return response.data;
};

// Evaluation API
export const evaluateExpense = async (expenseData: any) => {
  const response = await api.post('/evaluate', expenseData);
  return response.data;
};

export default api;
