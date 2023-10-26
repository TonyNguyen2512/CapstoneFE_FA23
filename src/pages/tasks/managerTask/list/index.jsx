import React from "react";
import ManagerTaskList from "./components/TaskList";
import { ALL_PERMISSIONS } from "../../../../constants/app";
import { usePermissions } from "../../../../hooks/permission";

export const ManagerTaskListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.tasks.view);

  return <div>{canView && <ManagerTaskList />}</div>;
};
