import React from "react";
import { OrderReportList } from "./components/OrderReportList";
import { usePermissions } from "../../../../hooks/permission";
import { ALL_PERMISSIONS } from "../../../../constants/app";

const OrderReportListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.orderReports.view);
  return canView && <OrderReportList />;
};

export default OrderReportListPage;
