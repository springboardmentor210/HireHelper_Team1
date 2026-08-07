// Temporary Service Layer
// Replace mock data with backend API calls later.

import mockRequests from "../data/mockRequests";

// Get all requests
export const getRequests = async () => {
  return Promise.resolve({
    success: true,
    data: mockRequests,
  });
};

// Accept a request
export const acceptRequest = async (requestId) => {
  return Promise.resolve({
    success: true,
    message: "Request accepted successfully.",
    requestId,
  });
};

// Decline a request
export const declineRequest = async (requestId) => {
  return Promise.resolve({
    success: true,
    message: "Request declined successfully.",
    requestId,
  });
};

// Archive a request
export const archiveRequest = async (requestId) => {
  return Promise.resolve({
    success: true,
    message: "Request archived successfully.",
    requestId,
  });
};