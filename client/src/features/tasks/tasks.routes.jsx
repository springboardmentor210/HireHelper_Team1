import React from "react";
import { Route } from "react-router-dom";

import MyTasks from "./pages/MyTasks";
import AddTask from "./pages/AddTask";
import TaskApplicants from "./pages/TaskApplicants";

const TasksRoutes = (
  <>
    <Route
      path="/tasks"
      element={<MyTasks />}
    />

    <Route
      path="/tasks/add"
      element={<AddTask />}
    />

    <Route
      path="/tasks/:taskId"
      element={<MyTasks />}
    />

    <Route
      path="/tasks/:taskId/applicants"
      element={<TaskApplicants />}
    />

    <Route
      path="/tasks/:taskId/edit"
      element={<AddTask />}
    />
  </>
);

export default TasksRoutes;