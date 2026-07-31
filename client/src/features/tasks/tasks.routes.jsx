import React from "react";
import { Route } from "react-router-dom";
import MyTasks from "./pages/MyTasks";
import AddTask from "./pages/AddTask";

// If your project uses a route-array style, adapt accordingly.
// This exposes reusable routes for the tasks feature.
const TasksRoutes = (
  <>
    <Route path="/tasks" element={<MyTasks />} />
    <Route path="/tasks/add" element={<AddTask />} />
    <Route path="/tasks/:taskId" element={<MyTasks />} />
    <Route path="/tasks/:taskId/applicants" element={<MyTasks />} />
    <Route path="/tasks/:taskId/edit" element={<AddTask />} />
  </>
);

export default TasksRoutes;