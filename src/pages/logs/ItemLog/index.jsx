import React from "react";
import ItemLogModal from "./components/ItemLogModal";
import { usePermissions } from "../../../hooks/permission";
import { ALL_PERMISSIONS } from "../../../constants/app";

export const ItemLogListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.groupsLog.view);

  return <div>{canView && <ItemLogModal />}</div>;
};
