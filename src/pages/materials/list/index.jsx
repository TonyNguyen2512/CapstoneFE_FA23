import React from "react";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import MaterialList from "./components/MaterialList";

export const MaterialListPage = () => {
	const permissions = usePermissions();
	const canView = permissions?.includes(ALL_PERMISSIONS.materials.view);

	return <div>{canView && <MaterialList />}</div>;
};
