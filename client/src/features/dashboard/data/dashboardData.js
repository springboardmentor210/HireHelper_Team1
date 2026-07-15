export const guestData = {
  hero: {
    title: "Get help with everyday tasks, easily.",
    subtitle:
      "Find trusted helpers for your home, garden, painting, moving and more - or earn by helping others.",
  },

  stats: {
    customers: "10,000+",
    completed: "25,000+",
    rating: "4.8",
    helpers: "5,000+",
  },
};

export const newUserData = {
  userName: "Shameen",

  stats: [
    { id: 1, title: "Active Tasks", value: 0, icon: "📋" },
    { id: 2, title: "Pending Requests", value: 0, icon: "⏳" },
    { id: 3, title: "Completed Tasks", value: 0, icon: "✅" },
    { id: 4, title: "Money Saved", value: "₹0", icon: "💰" },
  ],

  quickActions: [
    { id: 1, title: "Post a Task", icon: "📝" },
    { id: 2, title: "Browse Feed", icon: "🔍" },
    { id: 3, title: "Become a Helper", icon: "🧑‍🔧" },
    { id: 4, title: "My Tasks", icon: "📋" },
  ],
};

export const returningUserData = {
  userName: "Shameen",

  stats: [
    { id: 1, title: "Active Tasks", value: 3, icon: "📋" },
    { id: 2, title: "Pending Requests", value: 8, icon: "⏳" },
    { id: 3, title: "Completed Tasks", value: 21, icon: "✅" },
    { id: 4, title: "Money Saved", value: "₹4,200", icon: "💰" },
  ],

  upcomingTasks: [
    {
      id: 1,
      title: "Room Cleaning",
      day: "Tomorrow",
      date: "May 8",
      time: "9:00 AM",
      helper: "Mita Das",
      type: "cleaning",
    },
    {
      id: 2,
      title: "Furniture Moving",
      day: "Tomorrow",
      date: "May 8",
      time: "4:00 PM",
      helper: "Ramesh Yadav",
      type: "moving",
    },
    {
      id: 3,
      title: "Painting Project",
      day: "Saturday",
      date: "May 10",
      time: "10:00 AM",
      helper: "Mukesh Kumar",
      type: "painting",
    },
  ],

  recentActivity: [
    {
      id: 1,
      text: "Mita accepted your cleaning request",
      type: "accepted",
    },
    {
      id: 2,
      text: "Payment of ₹850 completed",
      type: "payment",
    },
    {
      id: 3,
      text: "Garden cleanup task marked as complete",
      type: "completed",
    },
    {
      id: 4,
      text: "New request received for painting project",
      type: "request",
    },
  ],

  recommendedTasks: [
  {
    id: 1,
    title: "Furniture Repairing",
    image: "/furniture.jpg",
    location: "Downtown Seattle",
    schedule: "Jul 5 • 2:00 PM - 6:00 PM",
    price: "₹1,200",
  },
  {
    id: 2,
    title: "AC Cleanup",
    image: "/ac.jpg",
    location: "Downtown Seattle",
    schedule: "Jul 7 • 9:00 AM - 1:00 PM",
    price: "₹2,000",
  },
  {
    id: 3,
    title: "Kitchen Cleaning",
    image: "/kitchen.jpg",
    location: "Downtown Seattle",
    schedule: "Jul 9 • 8:00 AM - 5:00 PM",
    price: "₹3,500",
  },
],
};