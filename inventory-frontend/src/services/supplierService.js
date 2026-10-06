import api from './api'

export const getSuppliers = () => {
  return api.get("/suppliers");
};
export const createSupplier=(supplier)=>{
    return api.post("/suppliers/create_supplier",supplier)
}
export const getSupplierbyId=(supplierId)=>{
    return api.get(`/suppliers/${supplierId}`)
}
export const Updatesupplier=(supplierId,supplier)=>{
    return api.put(`/suppliers/${supplierId}`,supplier)
}
export const Deletesupplier=(supplierId)=>{
    return api.delete(`/suppliers/${supplierId}`)
}