import React from "react";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import ItemList from "./components/ItemList";

export const ItemListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.items.view);
  const canCreate = permissions?.includes(ALL_PERMISSIONS.items.create);
  const canUpdate = permissions?.includes(ALL_PERMISSIONS.items.update);

  return <div>{canView && <ItemList canModify={{ canCreate, canUpdate }} />}</div>;
};
