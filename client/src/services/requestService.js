import api from "./api";

// Get incoming requests for the logged-in task owner
export const getIncomingRequests = async (params = {}) => {
  const response = await api.get("/requests/incoming", {
    params: {
      status: "pending",
      ...params,
    },
  });

  return response.data;
};

// Get requests created by the logged-in user
export const getMyRequests = async (params = {}) => {
  const response = await api.get("/requests/mine", {
    params,
  });

  return response.data;
};

// Accept an incoming request
export const acceptRequest = async (requestId) => {
  const response = await api.patch(
    `/requests/${requestId}/accept`
  );

  return response.data;
};

// Decline an incoming request
export const declineRequest = async (requestId) => {
  const response = await api.patch(
    `/requests/${requestId}/decline`
  );

  return response.data;
};

// Cancel a request created by the logged-in user
export const cancelRequest = async (requestId) => {
  const response = await api.patch(
    `/requests/${requestId}/cancel`
  );

  return response.data;
};