import api from "./api";

// Get incoming pending requests
export const getIncomingRequests = async () => {
  const response = await api.get("/requests/incoming", {
    params: {
      status: "pending",
    },
  });

  return response.data;
};

// Accept request
export const acceptRequest = async (requestId) => {
  const response = await api.patch(
    `/requests/${requestId}/accept`
  );

  return response.data;
};

// Decline request
export const declineRequest = async (requestId) => {
  const response = await api.patch(
    `/requests/${requestId}/decline`
  );

  return response.data;
};