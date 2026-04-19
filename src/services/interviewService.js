import api from "./api";

export async function fetchInterviewQuestions(params = {}) {
  const { data } = await api.get("/api/interview/questions", { params });
  return data;
}

export async function fetchInterviewQuestion(id, slug) {
  const { data } = await api.get(`/api/interview/questions/${id}/${slug}`);
  return data;
}

export async function fetchInterviewTopics() {
  const { data } = await api.get("/api/interview/topics");
  return data;
}

export async function fetchInterviewTopic(slug) {
  const { data } = await api.get(`/api/interview/topics/${slug}`);
  return data;
}

export async function fetchCompanies() {
  const { data } = await api.get("/api/interview/companies");
  return data;
}

export async function runCode(payload) {
  const { data } = await api.post("/api/interview/compiler/run", payload);
  return data;
}

export async function createQuestion(payload) {
  const { data } = await api.post("/api/interview/questions", payload);
  return data;
}

export async function updateQuestion(id, payload) {
  const { data } = await api.put(`/api/interview/questions/${id}`, payload);
  return data;
}

export async function deleteQuestion(id) {
  const { data } = await api.delete(`/api/interview/questions/${id}`);
  return data;
}

export async function createTopic(payload) {
  const { data } = await api.post("/api/interview/topics", payload);
  return data;
}

export async function updateTopic(id, payload) {
  const { data } = await api.put(`/api/interview/topics/${id}`, payload);
  return data;
}

export async function deleteTopic(id) {
  const { data } = await api.delete(`/api/interview/topics/${id}`);
  return data;
}

export async function createCompany(payload) {
  const { data } = await api.post("/api/interview/companies", payload);
  return data;
}

export async function updateCompany(id, payload) {
  const { data } = await api.put(`/api/interview/companies/${id}`, payload);
  return data;
}

export async function fetchInterviewAnalytics() {
  const { data } = await api.get("/api/interview/admin/analytics/overview");
  return data;
}

export async function fetchTopQuestions() {
  const { data } = await api.get("/api/interview/admin/analytics/top-questions");
  return data;
}

export async function fetchCompilerStats() {
  const { data } = await api.get("/api/interview/admin/analytics/compiler-stats");
  return data;
}
