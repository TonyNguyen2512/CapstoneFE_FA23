import React from "react";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import MaterialTypeList from "./components/MaterialTypeList";

export const MaterialTypeListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.materialTypes.view);
  const canCreate = permissions?.includes(ALL_PERMISSIONS.materialTypes.create);
  const canUpdate = permissions?.includes(ALL_PERMISSIONS.materialTypes.update);

  return <div>{canView && <MaterialTypeList canModify={{ canCreate, canUpdate }} />}</div>;
};
