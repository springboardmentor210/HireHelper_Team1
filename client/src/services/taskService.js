import api from "../config/api";

const USE_MOCK = true; // Switch to false when backend is ready

// ============ MOCK DATA (Inline) ============
const mockStats = {
  active: 12,
  inProgress: 5,
  completed: 84,
  totalApplicants: 23,
  totalEarnings: 2340,
};

const mockTasks = [
  {
    id: "t1",
    title: "Computer Setup",
    description:
      "Need help setting up my new home office computer and network. Technical knowledge required.",
    category: "Tech",
    status: "Active",
    budget: 1200,
    date: "Jul 6, 2026",
    time: "3:00 PM - 6:00 PM",
    location: "Downtown Seattle, WA",
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
    applicants: 5,
    isBookmarked: false,
    earnings: 0,
  },
  {
    id: "t2",
    title: "Car Wash & Detail",
    description:
      "Looking for someone to wash and detail my car. All supplies will be provided.",
    category: "Car Care",
    status: "In Progress",
    budget: 800,
    date: "Jul 9, 2026",
    time: "10:00 AM - 12:00 PM",
    location: "Bellevue, WA",
    image:
      "https://images.unsplash.com/photo-1605164599901-db7f68c4b0f8?w=800&q=80",
    applicants: 3,
    isBookmarked: true,
    earnings: 0,
  },
  {
    id: "t3",
    title: "Garden Cleanup",
    description:
      "Need help cleaning up my backyard garden. Weeding, pruning and general cleanup.",
    category: "Gardening",
    status: "Scheduled",
    budget: 500,
    date: "Jul 12, 2026",
    time: "9:00 AM - 1:00 PM",
    location: "Redmond, WA",
    image:
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80",
    applicants: 6,
    isBookmarked: false,
    earnings: 0,
  },
  {
    id: "t4",
    title: "Furniture Assembly",
    description:
      "Help assemble a new sofa and coffee table. Tools will be provided.",
    category: "Assembly",
    status: "Completed",
    budget: 600,
    date: "June 28, 2026",
    time: "2:00 PM - 4:00 PM",
    location: "Seattle, WA",
    image:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80",
    applicants: 4,
    isBookmarked: false,
    earnings: 600,
  },
];
// ============ SERVICE FUNCTIONS ============

// GET /api/tasks -> Task[]
export const getTasks = async (params = {}) => {
  if (USE_MOCK) return Promise.resolve(mockTasks);
  const { data } = await api.get("/tasks", { params });
  return data;
};

// GET /api/tasks/:id -> Task
export const getTaskById = async (id) => {
  if (USE_MOCK) return mockTasks.find((t) => t.id === id);
  const { data } = await api.get(`/tasks/${id}`);
  return data;
};

// POST /api/tasks
export const createTask = async (payload) => {
  if (USE_MOCK) return { ...payload, id: `t${Date.now()}` };
  const { data } = await api.post("/tasks", payload);
  return data;
};

// PUT /api/tasks/:id
export const updateTask = async (id, payload) => {
  if (USE_MOCK) return { id, ...payload };
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data;
};
// DELETE /api/tasks/:id
export const deleteTask = async (id) => {
  if (USE_MOCK) return { success: true, id };
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};

// PATCH /api/tasks/:id/bookmark
export const bookmarkTask = async (id, bookmarked) => {
  if (USE_MOCK) return { id, bookmarked };
  const { data } = await api.patch(`/tasks/${id}/bookmark`, { bookmarked });
  return data;
};

// PATCH /api/tasks/:id/archive
export const archiveTask = async (id) => {
  if (USE_MOCK) return { id, archived: true };
  const { data } = await api.patch(`/tasks/${id}/archive`);
  return data;
};

// POST /api/tasks/:id/duplicate
export const duplicateTask = async (id) => {
  if (USE_MOCK) {
    const t = mockTasks.find((x) => x.id === id);
    return { ...t, id: `t${Date.now()}` };
  }
  const { data } = await api.post(`/tasks/${id}/duplicate`);
  return data;
};

// GET /api/tasks/:id/applicants
export const getApplicants = async (id) => {
  if (USE_MOCK) return [];
  const { data } = await api.get(`/tasks/${id}/applicants`);
  return data;
};

// GET /api/tasks/statistics
export const getStatistics = async () => {
  if (USE_MOCK) return mockStats;
  const { data } = await api.get("/tasks/statistics");
  return data;
};