import api from "./api";

// GET /api/tasks/my-tasks
export const getTasks = async (params = {}) => {
  const { data } = await api.get("/tasks/my-tasks", { params });
  return data;
};

export const getMyTasks = async (params = {}) => {
  const { data } = await api.get("/tasks/my-tasks", { params });
  return data;
};

// GET /api/tasks/:id
export const getTaskById = async (id) => {
  const { data } = await api.get(`/tasks/${id}`);
  return data;
};

// POST /api/tasks
export const createTask = async (payload) => {
  const { data } = await api.post("/tasks", payload);
  return data;
};

// PUT /api/tasks/:id
export const updateTask = async (id, payload) => {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data;
};

// DELETE /api/tasks/:id
export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};

// PATCH /api/tasks/:id/bookmark
export const bookmarkTask = async (id) => {
  const { data } = await api.patch(`/tasks/${id}/bookmark`);
  return data;
};

// GET /api/tasks/:id/applicants
export const getApplicants = async (id) => {
  const { data } = await api.get(`/tasks/${id}/applicants`);
  return data;
};

// GET /api/tasks/statistics
export const getStatistics = async () => {
  const { data } = await api.get("/tasks/statistics");
  return data;
};