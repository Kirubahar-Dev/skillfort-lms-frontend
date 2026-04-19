import api from "./api";

export async function fetchAdminDashboard() {
  const { data } = await api.get("/api/admin/dashboard");
  return data;
}

export async function fetchAdminStudents({ page = 1, pageSize = 20, search = "", isActive = "" } = {}) {
  const params = { page, page_size: pageSize };
  if (search) params.search = search;
  if (isActive !== "") params.is_active = isActive;
  const { data } = await api.get("/api/admin/students", { params });
  return data;
}

export async function updateStudentStatus(userId, isActive) {
  const { data } = await api.patch(`/api/admin/students/${userId}/status`, null, { params: { is_active: isActive } });
  return data;
}

export async function fetchAdminInstructors({ page = 1, pageSize = 20, search = "" } = {}) {
  const params = { page, page_size: pageSize };
  if (search) params.search = search;
  const { data } = await api.get("/api/admin/instructors", { params });
  return data;
}

export async function createInstructor(payload) {
  const { data } = await api.post("/api/admin/instructors", null, { params: payload });
  return data;
}

export async function fetchAdminCategories() {
  const { data } = await api.get("/api/admin/categories");
  return data;
}

export async function createCategory(name) {
  const { data } = await api.post("/api/admin/categories", null, { params: { name } });
  return data;
}

export async function deleteCategory(categoryId) {
  const { data } = await api.delete(`/api/admin/categories/${categoryId}`);
  return data;
}

export async function fetchAdminOrders() {
  const { data } = await api.get("/api/admin/orders");
  return data;
}

export async function updateOrderStatus(orderId, status) {
  const { data } = await api.patch(`/api/admin/orders/${orderId}/status`, null, { params: { status } });
  return data;
}

export async function fetchAdminCoupons() {
  const { data } = await api.get("/api/admin/coupons");
  return data;
}

export async function createCoupon(payload) {
  const { data } = await api.post("/api/admin/coupons", null, { params: payload });
  return data;
}

export async function updateCouponStatus(couponId, isActive) {
  const { data } = await api.patch(`/api/admin/coupons/${couponId}/status`, null, { params: { is_active: isActive } });
  return data;
}

export async function fetchAdminReviews() {
  const { data } = await api.get("/api/admin/reviews");
  return data;
}

export async function updateReviewStatus(reviewId, status) {
  const { data } = await api.patch(`/api/admin/reviews/${reviewId}/status`, null, { params: { status } });
  return data;
}

export async function fetchAdminCertificates() {
  const { data } = await api.get("/api/admin/certificates");
  return data;
}

export async function fetchAdminSettings() {
  const { data } = await api.get("/api/admin/settings");
  return data;
}

export async function saveAdminSetting(key, value) {
  const { data } = await api.put("/api/admin/settings", null, { params: { key, value } });
  return data;
}

export async function fetchAdminCourseInsights() {
  const { data } = await api.get("/api/admin/courses/insights");
  return data;
}

export async function fetchInstructorHistory(instructorId) {
  const { data } = await api.get(`/api/admin/instructors/${instructorId}/history`);
  return data;
}

export async function fetchOrderDetail(orderId) {
  const { data } = await api.get(`/api/admin/orders/${orderId}`);
  return data;
}
