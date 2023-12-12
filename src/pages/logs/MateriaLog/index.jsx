import React from "react";
import { usePermissions } from "../../../../hooks/permission";
import { ALL_PERMISSIONS } from "../../../../constants/app";
import MaterialLogModal from "./components/MaterialLogModal";

export const MaterialLogListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.groupsLog.view);

  return <div>{canView && <MaterialLogModal />}</div>;
};
