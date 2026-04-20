import api from "./api";

export async function getLessonProgress(courseId) {
  const { data } = await api.get(`/api/learn/courses/${courseId}/progress`);
  return data;
}

export async function completeLesson(lessonId) {
  const { data } = await api.post(`/api/learn/lessons/${lessonId}/complete`);
  return data;
}

export async function getCertificateInfo(courseId) {
  const { data } = await api.get(`/api/learn/certificate/${courseId}/info`);
  return data;
}

export async function updateLessonVideo(lessonId, videoUrl) {
  const { data } = await api.patch(`/api/learn/admin/lessons/${lessonId}/video`, null, {
    params: { video_url: videoUrl }
  });
  return data;
}

export async function getAdminCourseProgress(courseId) {
  const { data } = await api.get(`/api/learn/admin/courses/${courseId}/student-progress`);
  return data;
}

export async function uploadLessonVideoFile(lessonId, file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post(`/api/learn/admin/lessons/${lessonId}/upload-video`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 600000, // 10 min for large video files
  });
  return data;
}

export async function downloadCertificatePdf(courseId, filename) {
  const response = await api.get(`/api/learn/certificate/${courseId}`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `certificate-${courseId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
