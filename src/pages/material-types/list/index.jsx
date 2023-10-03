import React from "react";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import MaterialTypeList from "./components/MaterialTypeList";

export const MaterialTypeListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.materialTypes.view);

  return <div>{canView && <MaterialTypeList />}</div>;
};
