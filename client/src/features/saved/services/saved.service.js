import api from "../../../services/api";

export const getSavedTasks = async (params = {}) => {
  const response = await api.get("/saved", { params });
  return response.data;
};

export const saveTask = async (taskId) => {
  const response = await api.post(`/saved/${taskId}`);
  return response.data;
};

export const unsaveTask = async (taskId) => {
  const response = await api.delete(`/saved/${taskId}`);
  return response.data;
};