import api from "./api";

export async function createOrder(payload) {
  const { data } = await api.post("/api/orders/create", payload);
  return data;
}

export async function confirmOrder(payload) {
  const { data } = await api.post("/api/orders/confirm", payload);
  return data;
}

export async function getMyOrders() {
  const { data } = await api.get("/api/orders/my");
  return data;
}

export async function getMyCertificates() {
  const { data } = await api.get("/api/orders/certificates/my");
  return data;
}
