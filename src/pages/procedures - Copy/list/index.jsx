import React from "react";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import StepList from "./components/StepList";

export const StepListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.steps.view);

  return <div>{canView && <StepList />}</div>;
};
