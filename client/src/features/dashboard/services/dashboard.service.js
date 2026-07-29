import api from "../../../config/api";

export const getDashboardSummary = async () => {
  const response = await api.get("/tasks/dashboard-summary");
  return response.data;
};