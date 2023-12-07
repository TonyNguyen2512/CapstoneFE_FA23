import React from "react";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import GroupList from "./components/GroupsList";

export const GroupListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.groups.view);

  return <div>{canView && <GroupList />}</div>;
};
