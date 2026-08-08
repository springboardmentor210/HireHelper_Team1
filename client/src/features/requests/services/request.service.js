import api from "../../../services/api";

// Get incoming requests for the logged-in task owner
export const getIncomingRequests = async () => {
  const response = await api.get("/requests/incoming", {
    params: {
      status: "pending",
    },
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