import React from "react";
import WorkerTaskList from "./components/WorkerTaskList";
import { ALL_PERMISSIONS } from "../../../../constants/app";
import { usePermissions } from "../../../../hooks/permission";

export const WorkerTaskListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.workersTasks.view);

  return <div>{canView && <WorkerTaskList />}</div>;
};
