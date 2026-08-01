import axios from 'axios';
import type { GenerateRequest, QaPlan, TestCase, TestPriority, VersionHistory } from '../types/qa';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const qaApi = {
  generate: (data: GenerateRequest) =>
    api.post<QaPlan>('/qa/generate', data).then((r) => r.data),

  getPlan: (id: number) =>
    api.get<QaPlan>(`/qa/${id}`).then((r) => r.data),

  savePlan: (planId: number) =>
    api.post<QaPlan>('/qa/save', { planId }).then((r) => r.data),

  getVersions: (planId: number) =>
    api.get<VersionHistory[]>(`/qa/${planId}/versions`).then((r) => r.data),

  getVersion: (planId: number, versionNumber: number) =>
    api.get<QaPlan>(`/qa/${planId}/versions/${versionNumber}`).then((r) => r.data),

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
