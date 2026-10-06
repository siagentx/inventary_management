import api from './api'

export const getCategories = () => {
  return api.get("/categories");
};
export const createCategories = (category) => {
  return api.post("/categories/createcategory",category);
};
export const getCategoriesbyid = (id) => {
  return api.get(`/categories/${id}`);
};
export const editCategories = (id,cat) => {
  return api.put(`/categories/${id}`,cat);
};
export const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};