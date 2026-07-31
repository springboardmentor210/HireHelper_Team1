import img1 from "../assets/images/img-1.jpg";
import img2 from "../assets/images/img-2.jpg";
import img3 from "../assets/images/img-3.jpg";
import img6 from "../assets/images/img-6.jpg";

const USE_MOCK = true; // Set to false when backend API is available

const INITIAL_MOCK_TASKS = [
  {
    id: "t1",
    title: "Computer Setup",
    description: "Need help setting up my new home office computer and network. Technical knowledge required.",
    category: "Tech",
    status: "Active",
    budget: 1200,
    date: "Jul 6, 2028",
    time: "3:00 PM - 6:00 PM",
    location: "Downtown Seattle, WA",
    image: img1,
    applicants: 5,
    isBookmarked: false,
    earnings: 0,
    applicantList: [
      { id: "a1", name: "Sarah Jenkins", rating: 4.9, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", offer: "₹1,200" },
      { id: "a2", name: "David Chen", rating: 4.8, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", offer: "₹1,150" },
      { id: "a3", name: "Alex Rivera", rating: 4.7, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", offer: "₹1,200" },
    ]
  },
  {
    id: "t2",
    title: "Car Wash & Detail",
    description: "Looking for someone to wash and detail my car. All supplies will be provided.",
    category: "Car Care",
    status: "In Progress",
    budget: 800,
    date: "Jul 9, 2028",
    time: "10:00 AM - 12:00 PM",
    location: "Bellevue, WA",
    image: img2,
    applicants: 5,
    isBookmarked: true,
    earnings: 0,
    applicantList: [
      { id: "a4", name: "Michael Scott", rating: 4.9, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80", offer: "₹800" },
      { id: "a5", name: "Emily Watson", rating: 5.0, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", offer: "₹750" }
    ]
  },
  {
    id: "t3",
    title: "Garden Cleanup",
    description: "Need help cleaning up my backyard garden. Weeding, pruning and general cleanup.",
    category: "Gardening",
    status: "Scheduled",
    budget: 500,
    date: "Jul 12, 2028",
    time: "9:00 AM - 1:00 PM",
    location: "Redmond, WA",
    image: img6,
    applicants: 8,
    isBookmarked: false,
    earnings: 0,
    applicantList: [
      { id: "a6", name: "James Wilson", rating: 4.6, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80", offer: "₹500" }
    ]
  },
  {
    id: "t4",
    title: "Furniture Assembly",
    description: "Help assemble a new sofa and coffee table. Tools will be provided.",
    category: "Assembly",
    status: "Completed",
    budget: 800,
    date: "June 28, 2026",
    time: "2:00 PM - 4:00 PM",
    location: "Seattle, WA",
    image: img3,
    applicants: 8,
    isBookmarked: false,
    earnings: 800,
    applicantList: [
      { id: "a7", name: "Robert Taylor", rating: 4.9, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80", offer: "₹800" }
    ]
  }
];

const getStoredTasks = () => {
  try {
    const data = localStorage.getItem("hire_helper_tasks");
    if (!data) {
      localStorage.setItem("hire_helper_tasks", JSON.stringify(INITIAL_MOCK_TASKS));
      return INITIAL_MOCK_TASKS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_MOCK_TASKS;
  }
};

const saveStoredTasks = (tasks) => {
  try {
    localStorage.setItem("hire_helper_tasks", JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save tasks:", e);
  }
};

// GET /api/tasks
export const getTasks = async (params = {}) => {
  if (USE_MOCK) {
    return Promise.resolve(getStoredTasks());
  }
  const { data } = await api.get("/tasks", { params });
  return data;
};

// GET /api/tasks/:id
export const getTaskById = async (id) => {
  if (USE_MOCK) {
    const tasks = getStoredTasks();
    return Promise.resolve(tasks.find((t) => t.id === id));
  }
  const { data } = await api.get(`/tasks/${id}`);
  return data;
};

// POST /api/tasks
export const createTask = async (payload) => {
  if (USE_MOCK) {
    const tasks = getStoredTasks();
    const newTask = {
      id: `t_${Date.now()}`,
      title: payload.title || "Untitled Task",
      description: payload.description || "",
      category: payload.category || "General",
      status: "Active",
      budget: Number(payload.budget) || 500,
      date: payload.startDate || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: payload.startTime ? `${payload.startTime} - ${payload.endTime || "TBD"}` : "10:00 AM - 2:00 PM",
      location: payload.location || "Local",
      image: payload.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      applicants: 0,
      isBookmarked: false,
      earnings: 0,
      applicantList: []
    };
    const updated = [newTask, ...tasks];
    saveStoredTasks(updated);
    return Promise.resolve(newTask);
  }
  const { data } = await api.post("/tasks", payload);
  return data;
};

// PUT /api/tasks/:id
export const updateTask = async (id, payload) => {
  if (USE_MOCK) {
    const tasks = getStoredTasks();
    const updated = tasks.map((t) => (t.id === id ? { ...t, ...payload } : t));
    saveStoredTasks(updated);
    return Promise.resolve(updated.find((t) => t.id === id));
  }
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data;
};

// DELETE /api/tasks/:id
export const deleteTask = async (id) => {
  if (USE_MOCK) {
    const tasks = getStoredTasks();
    const filtered = tasks.filter((t) => t.id !== id);
    saveStoredTasks(filtered);
    return Promise.resolve({ success: true, id });
  }
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};

// PATCH /api/tasks/:id/bookmark
export const bookmarkTask = async (id) => {
  if (USE_MOCK) {
    const tasks = getStoredTasks();
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, isBookmarked: !t.isBookmarked } : t
    );
    saveStoredTasks(updated);
    return Promise.resolve({ id, success: true });
  }
  const { data } = await api.patch(`/tasks/${id}/bookmark`);
  return data;
};

// POST /api/tasks/:id/duplicate
export const duplicateTask = async (id) => {
  if (USE_MOCK) {
    const tasks = getStoredTasks();
    const target = tasks.find((t) => t.id === id);
    if (!target) return Promise.reject("Task not found");
    const duplicated = {
      ...target,
      id: `t_${Date.now()}`,
      title: `${target.title} (Copy)`,
      status: "Active",
      applicants: 0,
      applicantList: []
    };
    const updated = [duplicated, ...tasks];
    saveStoredTasks(updated);
    return Promise.resolve(duplicated);
  }
  const { data } = await api.post(`/tasks/${id}/duplicate`);
  return data;
};

// GET /api/tasks/:id/applicants
export const getApplicants = async (id) => {
  if (USE_MOCK) {
    const tasks = getStoredTasks();
    const task = tasks.find((t) => t.id === id);
    return Promise.resolve(task?.applicantList || []);
  }
  const { data } = await api.get(`/tasks/${id}/applicants`);
  return data;
};

// GET /api/tasks/statistics
export const getStatistics = async () => {
  if (USE_MOCK) {
    const tasks = getStoredTasks();
    if (!tasks || tasks.length === 0) {
      return Promise.resolve({
        active: 0,
        inProgress: 0,
        completed: 0,
        totalApplicants: 0,
        totalEarnings: 0
      });
    }
    const active = tasks.filter((t) => t.status === "Active").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const totalApplicants = tasks.reduce((sum, t) => sum + (t.applicants || 0), 0);
    const totalEarnings = tasks.reduce((sum, t) => sum + (t.status === "Completed" ? (t.budget || 0) : 0), 0);

    return Promise.resolve({
      active: active || 12,
      inProgress: inProgress || 5,
      completed: completed || 84,
      totalApplicants: totalApplicants || 23,
      totalEarnings: totalEarnings || 2340
    });
  }
  const { data } = await api.get("/tasks/statistics");
  return data;
};