import api from "./api";

const categoryDisplayMap = {
  moving: "Moving",
  gardening: "Gardening",
  cleaning: "Cleaning",
  painting: "Painting",
  assembly: "Assembly",
  pet_care: "Pet Care",
  tech_help: "Tech",
  car_care: "Car Care",
  other: "Other",
};

const statusDisplayMap = {
  active: "Active",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  scheduled: "Scheduled",
};

export const mapTaskData = (task) => {
  if (!task) return task;

  const id = task._id || task.id;

  const price = task.price ?? task.budget ?? 0;

  const startDate = task.startDate
    ? typeof task.startDate === "string" &&
      task.startDate.includes(",")
      ? task.startDate
      : new Date(task.startDate).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        )
    : task.date || "";

  const startTime = task.startTime
    ? task.endTime
      ? `${task.startTime} - ${task.endTime}`
      : task.startTime
    : task.time || "";

  const images =
    Array.isArray(task.images) &&
    task.images.length > 0
      ? task.images
      : task.image
      ? [task.image]
      : [];

  return {
    ...task,

    id,
    _id: id,

    title: task.title || "",
    description: task.description || "",

    category:
      categoryDisplayMap[task.category] ||
      task.category ||
      "General",

    status:
      statusDisplayMap[task.status] ||
      task.status ||
      "Active",

    price,
    budget: price,

    startDate,
    date: startDate,

    startTime,
    time: startTime,

    endTime: task.endTime || null,

    location: task.location || "",

    images,
    image: images[0] || "",

    applicants:
      task.applicantsCount ??
      task.applicants ??
      0,

    earnings:
      task.status === "completed" ||
      task.status === "Completed"
        ? price
        : 0,
  };
};

// ============================================================
// GET /api/tasks/my-tasks
// ============================================================

export const getMyTasks = async (
  params = {}
) => {
  const { data } = await api.get(
    "/tasks/my-tasks",
    { params }
  );

  const payload =
    data?.data ||
    data ||
    {};

  const rawTasks =
    payload.tasks ||
    (Array.isArray(payload)
      ? payload
      : []);

  const mappedTasks =
    rawTasks.map(mapTaskData);

  return {
    tasks: mappedTasks,

    stats:
      payload.stats || {
        active: 0,
        inProgress: 0,
        completed: 0,
        totalApplicants: 0,
        totalEarnings: 0,
      },

    pagination:
      payload.pagination || null,
  };
};

// ============================================================
// GET /api/tasks
// Delegates to getMyTasks for My Tasks views
// ============================================================

export const getTasks = async (
  params = {}
) => {
  const result =
    await getMyTasks(params);

  return result.tasks;
};

// ============================================================
// GET /api/tasks/:id
// ============================================================

export const getTaskById = async (
  id
) => {
  const { data } =
    await api.get(
      `/tasks/${id}`
    );

  const task =
    data?.data || data;

  return mapTaskData(task);
};

// ============================================================
// POST /api/tasks
// ============================================================

export const createTask = async (
  payload
) => {
  const todayDate =
    new Date()
      .toISOString()
      .split("T")[0];

  const formData =
    new FormData();

  formData.append(
    "title",
    payload.title?.trim() || ""
  );

  formData.append(
    "description",
    payload.description?.trim() || ""
  );

  formData.append(
    "location",
    payload.location?.trim() || ""
  );

  // Send coordinates for GeoJSON
  // distance-based feed sorting.
  if (
    payload.lat !== undefined &&
    payload.lat !== null
  ) {
    formData.append(
      "lat",
      payload.lat
    );
  }

  if (
    payload.lng !== undefined &&
    payload.lng !== null
  ) {
    formData.append(
      "lng",
      payload.lng
    );
  }

  formData.append(
    "category",
    payload.category || ""
  );

  formData.append(
    "price",
    payload.price ??
      (payload.budget
        ? Number(payload.budget)
        : 0)
  );

  formData.append(
    "startDate",
    payload.startDate ||
      todayDate
  );

  formData.append(
    "startTime",
    payload.startTime ||
      "10:00"
  );

  if (payload.endDate) {
    formData.append(
      "endDate",
      payload.endDate
    );
  }

  if (payload.endTime) {
    formData.append(
      "endTime",
      payload.endTime
    );
  }

  // Send the actual image file
  if (
    payload.image instanceof File
  ) {
    formData.append(
      "image",
      payload.image
    );
  }

  const { data } =
    await api.post(
      "/tasks",
      formData
    );

  const task =
    data?.data || data;

  return mapTaskData(task);
};

// ============================================================
// PATCH /api/tasks/:id
// ============================================================

export const updateTask = async (
  id,
  payload
) => {
  const { data } =
    await api.patch(
      `/tasks/${id}`,
      payload
    );

  const task =
    data?.data || data;

  return mapTaskData(task);
};

// ============================================================
// PATCH /api/tasks/:id/status
// ============================================================

export const updateTaskStatus = async (
  id,
  status
) => {
  const { data } =
    await api.patch(
      `/tasks/${id}/status`,
      { status }
    );

  const task =
    data?.data || data;

  return mapTaskData(task);
};

// ============================================================
// DELETE /api/tasks/:id
// ============================================================

export const deleteTask = async (
  id
) => {
  const { data } =
    await api.delete(
      `/tasks/${id}`
    );

  return data?.data || data;
};

// ============================================================
// GET /api/tasks/statistics
// ============================================================

export const getStatistics =
  async () => {
    const result =
      await getMyTasks();

    return result.stats;
  };

// ============================================================
// GET /api/tasks/feed
// ============================================================

export const getFeedTasks =
  async (
    params = {}
  ) => {
    const { data } =
      await api.get(
        "/tasks/feed",
        { params }
      );

    const payload =
      data?.data ||
      data ||
      {};

    const rawTasks =
      payload.tasks || [];

    return rawTasks.map(
      mapTaskData
    );
  };