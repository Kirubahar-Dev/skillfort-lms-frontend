import api from "./api";

export async function fetchStaticPage(slug) {
  const { data } = await api.get(`/api/courses/pages/${slug}`);
  return data;
}
