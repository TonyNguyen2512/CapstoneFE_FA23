import React from "react";
import { ReportList } from "./components/ReportList";
import { usePermissions } from "../../../../hooks/permission";
import { ALL_PERMISSIONS } from "../../../../constants/app";

const OrderReportListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.foremanReports.view);
  return <ReportList />;
};

export default OrderReportListPage;
