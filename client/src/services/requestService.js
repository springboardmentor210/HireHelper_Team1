import movingImg from "../assets/images/moving.png";
import paintingImg from "../assets/images/painting.png";
import gardeningImg from "../assets/images/gardening.png";
import img3 from "../assets/images/img-3.jpg";
import img2 from "../assets/images/img-2.jpg";

const USE_MOCK = true; // Set to false when backend API is connected

const INITIAL_MOCK_REQUESTS = [
  {
    id: "req_1",
    taskId: "t_mov_1",
    taskTitle: "Help Moving Furniture",
    ownerName: "Sarah Johnson",
    ownerInitials: "SJ",
    avatarBg: "#f1f5f9",
    avatarColor: "#334155",
    category: "moving",
    status: "Pending",
    message: "I'd be happy to help with your move! I have experience with heavy lifting and can bring some moving equipment. Available Saturday afternoon as requested.",
    createdAtFormatted: "Sent Jul 4, 10:00 AM",
    location: "Downtown Seattle, WA",
    taskImage: movingImg,
    isExpanded: true
  },
  {
    id: "req_2",
    taskId: "t_paint_1",
    taskTitle: "Room Painting Project",
    ownerName: "Emily Carter",
    ownerInitials: "EC",
    avatarBg: "#dcfce7",
    avatarColor: "#166534",
    category: "painting",
    status: "Accepted",
    message: "I have standard painting tools, rollers, and ladder ready. I can complete the walls and trim within 1-2 days as scheduled.",
    createdAtFormatted: "Sent Jul 2, 8:00 AM",
    location: "Redmond, WA",
    taskImage: paintingImg,
    isExpanded: false
  },
  {
    id: "req_3",
    taskId: "t_gard_1",
    taskTitle: "Garden Cleanup",
    ownerName: "Robert Wilson",
    ownerInitials: "RW",
    avatarBg: "#e0e7ff",
    avatarColor: "#3730a3",
    category: "gardening",
    status: "Accepted",
    message: "Happy to help clean up weeds, trim shrubs, and tidy the backyard beds. Bringing my own garden tools.",
    createdAtFormatted: "Sent Jul 1, 9:30 AM",
    location: "Bellevue, WA",
    taskImage: gardeningImg,
    isExpanded: false
  },
  {
    id: "req_4",
    taskId: "t_tv_1",
    taskTitle: "TV Mounting",
    ownerName: "Thomas Brown",
    ownerInitials: "TB",
    avatarBg: "#ffedd5",
    avatarColor: "#9a3412",
    category: "assembly",
    status: "Accepted",
    message: "I have a heavy-duty stud finder, drill, power tools, and level. Ready to assist with wall mounting your TV safely.",
    createdAtFormatted: "Sent Jun 30, 2:15 AM",
    location: "Kirkland, WA",
    taskImage: img3,
    isExpanded: false
  },
  {
    id: "req_5",
    taskId: "t_car_1",
    taskTitle: "Car Wash & Detail",
    ownerName: "Alex Clark",
    ownerInitials: "AC",
    avatarBg: "#ffe4e6",
    avatarColor: "#9f1239",
    category: "car care",
    status: "Accepted",
    message: "Experienced with vehicle hand washing, interior vacuuming, and mirror detailing. Free on Sunday morning.",
    createdAtFormatted: "Sent Jun 29, 11:00 AM",
    location: "Seattle, WA",
    taskImage: img2,
    isExpanded: false
  }
];

const INITIAL_MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    title: "Request Accepted!",
    message: "Sarah Johnson accepted your offer for 'Help Moving Furniture'.",
    time: "10m ago",
    read: false,
    type: "success"
  },
  {
    id: "n2",
    title: "New Message from Owner",
    message: "Emily Carter sent you a message regarding 'Room Painting Project'.",
    time: "1h ago",
    read: true,
    type: "info"
  },
  {
    id: "n3",
    title: "Task Completed",
    message: "Your work on 'Garden Cleanup' was marked as complete by Robert.",
    time: "1d ago",
    read: true,
    type: "neutral"
  }
];

const getStoredRequests = () => {
  try {
    const data = localStorage.getItem("hire_helper_my_requests");
    if (!data) {
      localStorage.setItem("hire_helper_my_requests", JSON.stringify(INITIAL_MOCK_REQUESTS));
      return INITIAL_MOCK_REQUESTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_MOCK_REQUESTS;
  }
};

const saveStoredRequests = (requests) => {
  try {
    localStorage.setItem("hire_helper_my_requests", JSON.stringify(requests));
  } catch (e) {
    console.error("Failed to save requests:", e);
  }
};

// GET /api/my-requests
export const getMyRequests = async () => {
  if (USE_MOCK) {
    return Promise.resolve(getStoredRequests());
  }
  // const { data } = await api.get("/my-requests");
  // return data;
};

// POST /api/my-requests/:id/cancel
export const cancelRequest = async (id) => {
  if (USE_MOCK) {
    const requests = getStoredRequests();
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status: "Cancelled", isExpanded: false } : req
    );
    saveStoredRequests(updated);
    return Promise.resolve({ success: true, id, status: "Cancelled" });
  }
  // const { data } = await api.post(`/my-requests/${id}/cancel`);
  // return data;
};

// GET /api/notifications
export const getNotifications = async () => {
  if (USE_MOCK) {
    return Promise.resolve(INITIAL_MOCK_NOTIFICATIONS);
  }
  // const { data } = await api.get("/notifications");
  // return data;
};

// RESET to initial mock data (utility for testing)
export const resetMockRequests = () => {
  localStorage.setItem("hire_helper_my_requests", JSON.stringify(INITIAL_MOCK_REQUESTS));
  return INITIAL_MOCK_REQUESTS;
};
