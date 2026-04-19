import api from "./api";

export async function getInstructorDashboard() {
  const { data } = await api.get("/api/instructor/dashboard");
  return data;
}

export async function getInstructorCourses() {
  const { data } = await api.get("/api/instructor/courses");
  return data;
}

export async function getCourseStudents(courseId) {
  const { data } = await api.get(`/api/instructor/courses/${courseId}/students`);
  return data;
}

export async function getCourseReviews(courseId) {
  const { data } = await api.get(`/api/instructor/courses/${courseId}/reviews`);
  return data;
}

export async function getInstructorAnalytics() {
  const { data } = await api.get("/api/instructor/analytics");
  return data;
}
