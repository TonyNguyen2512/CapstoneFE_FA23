import React from "react";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import TaskDetails from "./components/TaskDetails";

export const TaskDetailsPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.tasks.view);

  return <div>{canView && <TaskDetails />}</div>;
};
