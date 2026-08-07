import api from "../../../config/api";

// Fetch incoming requests.
export const getIncomingRequests = async (status = "pending", page = 1, limit = 12) => {
  const response = await api.get("/requests/incoming", {
    params: { status, page, limit },
  });
  return response.data;
};

// Fetch user's requests.
export const getMyRequests = async (status = "all", page = 1, limit = 12) => {
  const response = await api.get("/requests/mine", {
    params: { status, page, limit },
  });
  return response.data;
};

// Create request.
export const createRequest = async (taskId, message) => {
  const response = await api.post("/requests", { taskId, message });
  return response.data;
};

// Accept request.
export const acceptRequest = async (requestId) => {
  const response = await api.patch(`/requests/${requestId}/accept`);
  return response.data;
};

// Decline request.
export const declineRequest = async (requestId) => {
  const response = await api.patch(`/requests/${requestId}/decline`);
  return response.data;
};

// Cancel request.
export const cancelRequest = async (requestId) => {
  const response = await api.patch(`/requests/${requestId}/cancel`);
  return response.data;
};