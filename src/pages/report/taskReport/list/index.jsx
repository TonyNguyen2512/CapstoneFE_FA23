import React from "react";
import { usePermissions } from "../../../../hooks/permission";
import { ALL_PERMISSIONS } from "../../../../constants/app";
import { TaskReportList } from "./components/TaskReportList";

const TaskReportListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.taskReports.view);
  return canView && <TaskReportList />;
};

export default TaskReportListPage;
