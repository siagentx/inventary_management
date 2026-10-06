import api from "./api";

export const loginUser = (email, password) => {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  return api.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const getCurrentUser = () => {
  return api.get("/users/me");
};
export const getAdmin = () => {
  return api.get("/users/admin");
};
export const getUserByid = (userId) => {
  return api.get(`/users/${userId}`);
};

export const edituser = (userId,user) => {
  return api.put(`/users/${userId}`,user);
};
export const deleteuser = (userId) => {
  return api.delete(`/users/${userId}`);
};
export const registeruser = (user) => {
  return api.post(`/auth/register`,user);
};
