import React, { createContext, useState, useContext } from 'react';

import movingImage from "../assets/images/img-1.jpg";
import paintingImage from "../assets/images/img-2.jpg";
import packingImage from "../assets/images/img-3.jpg";
import plumbingImage from "../assets/images/img-4.jpg";
import deliveryImage from "../assets/images/img-5.jpg";
import gardeningImage from "../assets/images/img-6.jpg";
import garageCleaningImage from "../assets/images/img-7.jpg";
import gardenCleaningImage from "../assets/images/img-1.jpg"; // Reused since there are only 7 images

const initialTasks = [
  {
    id: 1,
    category: "Moving",
    title: "Help Moving Furniture",
    description: "Need help moving furniture from my apartment to a new house. Heavy lifting required.",
    location: "Downtown Seattle, WA",
    date: "Jul 5, 2026",
    time: "2:00 PM - 6:00 PM",
    user: "Robert Wilson",
    image: movingImage,
  },
  {
    id: 2,
    category: "Painting",
    title: "Room Painting Project",
    description: "Need help painting two bedrooms. Paint and supplies provided. Looking for someone with painting experience.",
    location: "Downtown Seattle, WA",
    date: "Jul 5, 2026",
    time: "2:00 PM - 6:00 PM",
    user: "Robert Wilson",
    image: paintingImage,
  },
  {
    id: 3,
    category: "Packaging",
    title: "Help Packing Household Items",
    description: "Looking for someone to help pack household items safely before moving to a new apartment.",
    location: "Seattle, WA",
    date: "Jul 5, 2026",
    time: "11:00 AM - 3:00 PM",
    user: "Robert Wilson",
    image: packingImage,
  },
  {
    id: 4,
    category: "Plumbing",
    title: "Kitchen Plumbing Assistance",
    description: "Need help checking a leaking kitchen sink and replacing a damaged pipe connection.",
    location: "Downtown Seattle, WA",
    date: "Jul 6, 2026",
    time: "2:00 PM - 5:00 PM",
    user: "David Miller",
    image: plumbingImage,
  },
  {
    id: 5,
    category: "Painting",
    title: "Living Room Painting",
    description: "Looking for someone with basic painting experience to help repaint my living room.",
    location: "Bellevue, WA",
    date: "Jul 6, 2026",
    time: "10:00 AM - 2:00 PM",
    user: "Sophia Brown",
    image: paintingImage,
  },
  {
    id: 6,
    category: "Cleaning",
    title: "Garden Cleanup",
    description: "Looking for someone to help clean up my backyard garden. Weeding, pruning and general cleanup.",
    location: "Bellevue, WA",
    date: "Jul 5, 2026",
    time: "9:00 AM - 1:00 PM",
    user: "Robert Wilson",
    image: gardenCleaningImage,
  },
  {
    id: 7,
    category: "Delivery",
    title: "Help With Grocery Delivery",
    description: "Need someone to pick up groceries from a nearby store and deliver them to my home.",
    location: "Seattle, WA",
    date: "Jul 6, 2026",
    time: "10:00 AM - 12:00 PM",
    user: "Emily Davis",
    image: deliveryImage,
  },
  {
    id: 8,
    category: "Gardening",
    title: "Backyard Gardening Help",
    description: "Looking for someone to help plant flowers and organize the backyard garden.",
    location: "Bellevue, WA",
    date: "Jul 7, 2026",
    time: "8:00 AM - 11:00 AM",
    user: "Michael Brown",
    image: gardeningImage,
  },
  {
    id: 9,
    category: "Cleaning",
    title: "Garage Cleaning Help",
    description: "Need help cleaning and organizing my garage. Basic cleaning tools will be provided.",
    location: "Redmond, WA",
    date: "Jul 8, 2026",
    time: "3:00 PM - 6:00 PM",
    user: "Sarah Miller",
    image: garageCleaningImage,
  },
];

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [feedTasks, setFeedTasks] = useState(initialTasks);
  const [myRequests, setMyRequests] = useState([]);
  const [myTasks, setMyTasks] = useState([]);

  const requestTask = (task) => {
    // Remove from feed
    setFeedTasks((prev) => prev.filter((t) => t.id !== task.id));
    // Add to my requests with 'requested' status
    setMyRequests((prev) => [{ ...task, status: 'requested' }, ...prev]);
  };

  const acceptTask = (taskId) => {
    // Find task in myRequests
    const task = myRequests.find((t) => t.id === taskId);
    if (!task) return;

    // Remove from myRequests
    setMyRequests((prev) => prev.filter((t) => t.id !== taskId));
    // Add to myTasks with 'accepted' status
    setMyTasks((prev) => [{ ...task, status: 'accepted' }, ...prev]);
  };

  return (
    <TaskContext.Provider value={{ feedTasks, myRequests, myTasks, requestTask, acceptTask }}>
      {children}
    </TaskContext.Provider>
  );
};
