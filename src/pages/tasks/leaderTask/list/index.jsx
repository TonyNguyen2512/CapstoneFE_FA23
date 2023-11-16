import React from "react";
import { ALL_PERMISSIONS } from "../../../../constants/app";
import { usePermissions } from "../../../../hooks/permission";
import LeaderTaskList from "./components/LeaderTaskList";

export const LeaderTaskListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.leadersTasks.view);

  return <div>{canView && <LeaderTaskList />}</div>;
};
