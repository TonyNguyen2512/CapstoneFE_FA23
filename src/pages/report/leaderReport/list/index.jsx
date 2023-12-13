import React from "react";
import { usePermissions } from "../../../../hooks/permission";
import { ALL_PERMISSIONS } from "../../../../constants/app";
import { LeaderReportList } from "./components/LeaderReportList";

const TaskReportListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.leaderReports.view);
  return canView && <LeaderReportList />;
};

export default TaskReportListPage;
