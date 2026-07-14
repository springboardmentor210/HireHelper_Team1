export const dashboardData = {
  userName: "Shameen",

  stats: {
    tasksPosted: 12,
    activeRequests: 8,
    completedTasks: 24,
    pendingRequests: 5,
  },

  recentTasks: [
    {
      id: 1,
      title: "Fix Washing Machine",
      category: "Appliance Repair",
      status: "Pending",
      budget: "₹500",
      location: "Hyderabad",
      date: "10 Jul 2026",
    },
    {
      id: 2,
      title: "House Cleaning",
      category: "Cleaning",
      status: "Completed",
      budget: "₹1200",
      location: "Bengaluru",
      date: "08 Jul 2026",
    },
    {
      id: 3,
      title: "Electrician Needed",
      category: "Electrical",
      status: "In Progress",
      budget: "₹800",
      location: "Chennai",
      date: "09 Jul 2026",
    },
    {
      id: 4,
      title: "AC Installation",
      category: "Home Service",
      status: "Accepted",
      budget: "₹1500",
      location: "Pune",
      date: "07 Jul 2026",
    },
  ],

  notifications: [
    {
      id: 1,
      message: "Your task 'House Cleaning' has been completed.",
      time: "2 hours ago",
    },
    {
      id: 2,
      message: "A helper accepted your Electrician request.",
      time: "5 hours ago",
    },
    {
      id: 3,
      message: "Payment for AC Installation is pending.",
      time: "Yesterday",
    },
  ],
  activities: [
  {
    id: 1,
    action: "New helper accepted your request",
    time: "10 mins ago",
  },
  {
    id: 2,
    action: "Payment received",
    time: "1 hour ago",
  },
  {
    id: 3,
    action: "Electrician task completed",
    time: "Yesterday",
  },
],
};