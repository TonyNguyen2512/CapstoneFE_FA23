import React from "react";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import ProcedureList from "./components/ProcedureList";

export const ProcedureListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.procedures.view);

  return <div>{canView && <ProcedureList />}</div>;
};
