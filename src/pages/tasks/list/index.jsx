import React from "react";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import TaskList from "./components/TaskList";

export const TaskListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.tasks.view);

  return <div>{canView && <TaskList />}</div>;
};
