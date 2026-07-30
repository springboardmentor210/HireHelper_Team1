import api from "../../../config/api";

export const getPublicStats = async () => {
  const response = await api.get("/tasks/public-stats");

  return response.data;
};
