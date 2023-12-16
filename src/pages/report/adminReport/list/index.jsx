import React from "react";
import { usePermissions } from "../../../../hooks/permission";
import { ALL_PERMISSIONS } from "../../../../constants/app";
import { AdminReportList } from "./components/TaskReportList";

const AdminReportListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.adminReports.view);
  return canView && <AdminReportList />;
};

export default AdminReportListPage;
