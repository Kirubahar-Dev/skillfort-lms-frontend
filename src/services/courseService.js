import api from "./api";

export async function fetchCourses(params = {}) {
  const { data } = await api.get("/api/courses", { params });
  return data;
}

export async function fetchCourseBySlug(slug) {
  const { data } = await api.get(`/api/courses/${slug}`);
  return data;
}

export async function fetchAdminCourses() {
  const { data } = await api.get("/api/courses/admin/list");
  return data;
}

export async function createCourse(payload) {
  const { data } = await api.post("/api/courses/admin", payload);
  return data;
}

export async function updateCourse(courseId, payload) {
  const { data } = await api.put(`/api/courses/admin/${courseId}`, payload);
  return data;
}

export async function deleteCourse(courseId) {
  const { data } = await api.delete(`/api/courses/admin/${courseId}`);
  return data;
}

export async function fetchCourseLessons(courseId) {
  const { data } = await api.get(`/api/courses/admin/${courseId}/lessons`);
  return data;
}

export async function createCourseLesson(courseId, payload) {
  const { data } = await api.post(`/api/courses/admin/${courseId}/lessons`, payload);
  return data;
}

export async function updateCourseLesson(lessonId, payload) {
  const { data } = await api.put(`/api/courses/admin/lessons/${lessonId}`, payload);
  return data;
}

export async function deleteCourseLesson(lessonId) {
  const { data } = await api.delete(`/api/courses/admin/lessons/${lessonId}`);
  return data;
}
