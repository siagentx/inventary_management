import api from './api'

export const getSales = () => {
  return api.get("/salesorder");
};
export const createSO=(so)=>{
    return api.post("/salesorder/createso",so)
}
export const getSObyId=(soId)=>{
    return api.get(`/salesorder/${soId}`)
}
export const UpdateSO=(soId,so)=>{
    return api.put(`/salesorder/${soId}`,so)
}
export const DeleteSo=(soId)=>{
    return api.delete(`/salesorder/${soId}`)
}