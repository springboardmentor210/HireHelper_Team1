const API_BASE_URL = "http://localhost:5001/api";

// =========================================================
// AUTHENTICATION
// =========================================================

const getToken = () => {
  return localStorage.getItem("token");
};

// =========================================================
// COMMON HEADERS
// =========================================================

const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// =========================================================
// HANDLE API RESPONSE
// =========================================================

const handleResponse = async (response) => {
  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        data?.error ||
        "Something went wrong"
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};

// =========================================================
// GET ALL CONVERSATIONS
// =========================================================

export const getConversations = async () => {
  const response = await fetch(
    `${API_BASE_URL}/conversations`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
};

// =========================================================
// GET MESSAGES
// =========================================================

export const getMessages = async (
  conversationId
) => {
  if (!conversationId) {
    throw new Error(
      "Conversation ID is required"
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/conversations/${conversationId}/messages`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse(response);
};

// =========================================================
// SEND MESSAGE
// =========================================================

export const sendMessage = async (
  conversationId,
  text
) => {
  if (!conversationId) {
    throw new Error(
      "Conversation ID is required"
    );
  }

  if (!text || !text.trim()) {
    throw new Error(
      "Message text is required"
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        text: text.trim(),
      }),
    }
  );

  return handleResponse(response);
};

// =========================================================
// MARK CONVERSATION AS READ
// =========================================================

export const markConversationAsRead =
  async (conversationId) => {
    if (!conversationId) {
      throw new Error(
        "Conversation ID is required"
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/conversations/${conversationId}/read`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  };