import api from './api'

export const getProducts = () => {
  return api.get("/products");
};
export const createProduct=(product)=>{
    return api.post("/products/create_product",product)
}
export const getProductbyId=(productId)=>{
    return api.get(`/products/${productId}`)
}
export const Updateproduct=(productId,product)=>{
    return api.put(`/products/${productId}`,product)
}
export const Deleteproduct=(productId)=>{
    return api.delete(`/products/${productId}`)
}