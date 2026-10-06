import api from './api'

export const getStocktran = () => {
  return api.get("/stocktransactions");
};
export const createStocktran=(stocktran)=>{
    return api.post("/stocktransactions/create_tran",stocktran)
}
export const getStocktranbyId=(stockId)=>{
    return api.get(`/stocktransactions/${stockId}`)
}
export const Updatestocktran=(stockId,stocktran)=>{
    return api.put(`/stocktransactions/${stockId}`,stocktran)
}
export const Deletestocktran=(stockId)=>{
    return api.delete(`/stocktransactions/${stockId}`)
}