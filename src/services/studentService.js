import api from "./api";

export async function getStudentDashboard() {
  const { data } = await api.get("/api/student/dashboard");
  return data;
}

export async function getMyCourses() {
  const { data } = await api.get("/api/student/my-courses");
  return data;
}

export async function getLearnCourse(courseSlug) {
  const { data } = await api.get(`/api/student/learn/${courseSlug}`);
  return data;
}

export async function updateCourseProgress(courseSlug, lessonTitle, progressPercent) {
  const { data } = await api.post(`/api/student/learn/${courseSlug}/progress`, null, {
    params: { lesson_title: lessonTitle, progress_percent: progressPercent },
  });
  return data;
}

export async function addCourseNote(courseSlug, lessonTitle, noteText) {
  const { data } = await api.post(`/api/student/learn/${courseSlug}/notes`, null, {
    params: { lesson_title: lessonTitle, note_text: noteText },
  });
  return data;
}

export async function submitQuiz(courseSlug, score, total) {
  const { data } = await api.post(`/api/student/learn/${courseSlug}/quiz-submit`, null, {
    params: { score, total },
  });
  return data;
}

export async function getStudentOrders() {
  const { data } = await api.get("/api/student/orders");
  return data;
}

export async function getStudentCertificates() {
  const { data } = await api.get("/api/student/certificates");
  return data;
}

export async function getStudentReviews() {
  const { data } = await api.get("/api/student/reviews");
  return data;
}

export async function createStudentReview(courseId, rating, comment) {
  const { data } = await api.post("/api/student/reviews", null, { params: { course_id: courseId, rating, comment } });
  return data;
}

export async function updateStudentReview(reviewId, rating, comment) {
  const { data } = await api.put(`/api/student/reviews/${reviewId}`, null, { params: { rating, comment } });
  return data;
}

export async function deleteStudentReview(reviewId) {
  const { data } = await api.delete(`/api/student/reviews/${reviewId}`);
  return data;
}

export async function getStudentProfile() {
  const { data } = await api.get("/api/student/profile");
  return data;
}

export async function updateStudentProfile(payload) {
  const { data } = await api.put("/api/student/profile", null, {
    params: payload,
  });
  return data;
}

export async function uploadStudentPhoto(file) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post("/api/student/profile/photo", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getNotifications() {
  const { data } = await api.get("/api/student/notifications");
  return data;
}

export async function markAllNotificationsRead() {
  const { data } = await api.post("/api/student/notifications/mark-all-read");
  return data;
}
