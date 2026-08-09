import api from "../../../config/api";

export const getPublicStats = async () => {
  try {
    const response = await api.get("/dashboard/public-stats");
    return response.data;
  } catch (error) {
    const response = await api.get("/tasks/public-stats");
    return response.data;
  }
};

