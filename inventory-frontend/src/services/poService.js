import api from "./api";

export const createPO = (po) => {
  return api.post("/purchase_orders/create_purchase", po);
};

export const getPOs = () => {
  return api.get("/purchase_orders");
};

export const getPobyId = (poId) => {
  return api.get(`/purchase_orders/${poId}`);
};

export const Updatepo = (poId, po) => {
  return api.put(`/purchase_orders/${poId}`, po);
};

export const Deletepo = (poId) => {
  return api.delete(`/purchase_orders/${poId}`);
};

export const Statuspo = (poId) => {
  return api.put(`/purchase_orders/${poId}/receive`);
};
