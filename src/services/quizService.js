import api from "./api";

// ── Student ───────────────────────────────────────────────────────────────────

export async function getLessonQuizQuestions(lessonId) {
  const { data } = await api.get(`/api/quiz/lessons/${lessonId}/questions`);
  return data; // [{id, question, option_a, option_b, option_c, option_d}]
}

export async function submitLessonQuiz(lessonId, answers) {
  // answers: { [questionId]: "A"|"B"|"C"|"D" }
  const { data } = await api.post(`/api/quiz/lessons/${lessonId}/submit`, { answers });
  return data; // {passed, score, total, percent, progress_percent, results}
}

// ── Admin / Instructor ────────────────────────────────────────────────────────

export async function adminGetLessonQuestions(lessonId) {
  const { data } = await api.get(`/api/quiz/admin/lessons/${lessonId}/questions`);
  return data;
}

export async function adminGenerateQuestions(lessonId) {
  const { data } = await api.post(`/api/quiz/admin/lessons/${lessonId}/generate`);
  return data; // {generated, questions}
}

export async function adminAddQuestion(lessonId, question) {
  const { data } = await api.post(`/api/quiz/admin/lessons/${lessonId}/questions`, question);
  return data;
}

export async function adminUpdateQuestion(questionId, updates) {
  const { data } = await api.patch(`/api/quiz/admin/questions/${questionId}`, updates);
  return data;
}

export async function adminDeleteQuestion(questionId) {
  const { data } = await api.delete(`/api/quiz/admin/questions/${questionId}`);
  return data;
}

export async function adminApproveQuestion(questionId) {
  const { data } = await api.patch(`/api/quiz/admin/questions/${questionId}/approve`);
  return data;
}

export async function adminRejectQuestion(questionId) {
  const { data } = await api.patch(`/api/quiz/admin/questions/${questionId}/reject`);
  return data;
}
