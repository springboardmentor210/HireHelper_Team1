import api from "../../../config/api";

export const getDashboardSummary = async () => {
  try {
    const response = await api.get("/dashboard/summary");
    return response.data;
  } catch (error) {
    const response = await api.get("/tasks/dashboard-summary");
    return response.data;
  }
};