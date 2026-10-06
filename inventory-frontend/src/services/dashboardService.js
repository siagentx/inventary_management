import api from './api'

export const getdashboardSummary = () => {
  return api.get("/dashboard/summary");
};
export const getlowstock = () => {
  return api.get("/dashboard/low-stock");
};
export const getoutofstock = () => {
  return api.get("/dashboard/out-of-stock");
};
export const getrecenttransactions = () => {
  return api.get("/dashboard/recent-transactions");
};
export const gettopsellingproducts = () => {
  return api.get("/dashboard/top-selling-products");
};