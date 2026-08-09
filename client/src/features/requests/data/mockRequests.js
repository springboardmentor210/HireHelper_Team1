const mockRequests = [
  {
    _id: "req-001",
    status: "pending",

    requestor: {
      _id: "user-101",
      firstName: "Sarah",
      lastName: "Johnson",
      profilePicture: null,
      rating: 4.8,
      reviews: 124,
    },

    task: {
      _id: "task-001",
      title: "Help Moving Furniture",
      category: "Moving",
      description:
        "Need help moving furniture from my apartment to a new house. Heavy lifting required.",
      location: "Downtown Seattle, WA",
      date: "Jul 5, 2026 • 2:00 PM - 6:00 PM",
      ownerName: "Robert Wilson",
    },

    message:
      "Hi! I have extensive experience with furniture assembly and moving heavy items. I have all the necessary tools and would love to help.",
  },

  {
    _id: "req-002",
    status: "pending",

    requestor: {
      _id: "user-102",
      firstName: "Emily",
      lastName: "Chen",
      profilePicture: null,
      rating: 4.9,
      reviews: 89,
    },

    task: {
      _id: "task-002",
      title: "Room Painting Project",
      category: "Painting",
      description:
        "Need help painting two bedrooms. Paint and supplies provided.",
      location: "Downtown Seattle, WA",
      date: "Jul 5, 2026 • 2:00 PM - 6:00 PM",
      ownerName: "Robert Wilson",
    },

    message:
      "I'm available this afternoon and have previous painting experience. I'd love to help.",
  },

  {
    _id: "req-003",
    status: "accepted",

    requestor: {
      _id: "user-103",
      firstName: "Michael",
      lastName: "Brown",
      profilePicture: null,
      rating: 4.7,
      reviews: 63,
    },

    task: {
      _id: "task-003",
      title: "Garden Cleanup",
      category: "Cleaning",
      description:
        "Looking for someone to help clean up my backyard garden.",
      location: "Bellevue, WA",
      date: "Jul 6, 2026 • 9:00 AM - 1:00 PM",
      ownerName: "Robert Wilson",
    },

    message:
      "I have experience with gardening and landscaping. Happy to help.",
  },

  {
    _id: "req-004",
    status: "declined",

    requestor: {
      _id: "user-104",
      firstName: "David",
      lastName: "Miller",
      profilePicture: null,
      rating: 4.6,
      reviews: 58,
    },

    task: {
      _id: "task-004",
      title: "Kitchen Plumbing Assistance",
      category: "Plumbing",
      description:
        "Need help checking a leaking kitchen sink and replacing a damaged pipe.",
      location: "Seattle, WA",
      date: "Jul 6, 2026 • 3:00 PM - 5:00 PM",
      ownerName: "David Miller",
    },

    message:
      "I have worked on several plumbing repairs and can help replace the leaking connection.",
  },

  {
    _id: "req-005",
    status: "declined",

    requestor: {
      _id: "user-105",
      firstName: "Sophia",
      lastName: "Brown",
      profilePicture: null,
      rating: 5.0,
      reviews: 143,
    },

    task: {
      _id: "task-005",
      title: "Help With Grocery Delivery",
      category: "Delivery",
      description:
        "Need someone to pick up groceries from a nearby store and deliver them.",
      location: "Seattle, WA",
      date: "Jul 7, 2026 • 10:00 AM - 12:00 PM",
      ownerName: "Emily Davis",
    },

    message:
      "I'm available nearby and can complete the grocery delivery on time.",
  },
];

export default mockRequests;