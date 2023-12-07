import React from "react";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import ItemCategoryList from "./components/ItemCategoryList";

export const ItemCategoryListPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.itemCategories.view);
  const canCreate = permissions?.includes(ALL_PERMISSIONS.itemCategories.create);
  const canUpdate = permissions?.includes(ALL_PERMISSIONS.itemCategories.update);

  return <div>{canView && <ItemCategoryList canModify={{ canCreate, canUpdate }} />}</div>;
};
