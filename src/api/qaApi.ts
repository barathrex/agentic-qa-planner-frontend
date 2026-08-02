import axios from 'axios';
import type { GenerateRequest, QaPlan, TestCase, TestPriority } from '../types/qa';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Intercept requests to inject JWT bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qa_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const qaApi = {
  login: (developerName: string, password: string) =>
    api.post<{ token: string; developerName: string }>('/auth/login', { developerName, password }).then((r) => r.data),

  generate: (data: GenerateRequest) =>
    api.post<QaPlan>('/qa/generate', data).then((r) => r.data),

  getPlans: (search?: string) =>
    api.get<QaPlan[]>('/qa', { params: { search } }).then((r) => r.data),

  getPlan: (id: number) =>
    api.get<QaPlan>(`/qa/${id}`).then((r) => r.data),

  deletePlan: (id: number) =>
    api.delete(`/qa/${id}`).then((r) => r.data),

  downloadPdf: (id: number) =>
    api.get(`/qa/${id}/pdf`, { responseType: 'blob' }).then((r) => {
      const url = window.URL.createObjectURL(new Blob([r.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `QA_Plan_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }),

  savePlan: (planId: number) =>
    api.post<QaPlan>('/qa/save', { planId }).then((r) => r.data),

  updateTestCase: (id: number, data: Partial<TestCase>) =>
    api.put<TestCase>(`/qa/testcase/${id}`, data).then((r) => r.data),

  approveTestCase: (id: number) =>
    api.put<TestCase>(`/qa/testcase/${id}/approve`).then((r) => r.data),

  rejectTestCase: (id: number) =>
    api.put<TestCase>(`/qa/testcase/${id}/reject`).then((r) => r.data),

  updatePriority: (id: number, priority: TestPriority) =>
    api.put<TestCase>(`/qa/testcase/${id}/priority`, { priority }).then((r) => r.data),
};

export default api;
