import React from "react";
import { usePermissions } from "../../../../hooks/permission";
import { ALL_PERMISSIONS } from "../../../../constants/app";
import WorkerTaskDetailPage from "./components/TaskDetails";

export const WorkerTaskDetailsPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.tasks.view);

  return <div>{canView && <WorkerTaskDetailPage />}</div>;
};
