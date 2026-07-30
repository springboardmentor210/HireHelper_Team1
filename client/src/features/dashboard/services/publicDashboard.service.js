import api from "../../../config/api";

export const getPublicStats = async () => {
  const response = await api.get("/dashboard/public-stats");

  return response.data;
};
