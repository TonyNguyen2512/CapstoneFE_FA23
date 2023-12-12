import React from "react";
import { usePermissions } from "../../../../hooks/permission";
import { ALL_PERMISSIONS } from "../../../../constants/app";
import GroupLogModal from "./components/GroupLogModal";

export const GroupLogListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.groupsLog.view);

  return <div>{canView && <GroupLogModal />}</div>;
};
