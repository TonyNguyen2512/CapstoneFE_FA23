import React from "react";
import { ALL_PERMISSIONS } from "../../../../constants/app";
import { usePermissions } from "../../../../hooks/permission";
import ManagerTaskList from "./components/ManagerTaskList";

export const ManagerTaskListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.managersTasks.view);

  return <div>{canView && <ManagerTaskList />}</div>;
};
