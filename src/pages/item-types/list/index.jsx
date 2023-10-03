import React from "react";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import ItemTypeList from "./components/ItemTypeList";

export const ItemTypeListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.itemTypes.view);

  return <div>{canView && <ItemTypeList />}</div>;
};
