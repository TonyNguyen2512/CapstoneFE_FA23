import React from "react";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import MaterialList from "./components/MaterialList";

export const MaterialListPage = () => {
	const permissions = usePermissions();
	const canView = permissions?.includes(ALL_PERMISSIONS.materials.view);
	const canCreate = permissions?.includes(ALL_PERMISSIONS.materials.create);
	const canUpdate = permissions?.includes(ALL_PERMISSIONS.materials.update);

	return <div>{canView && <MaterialList canModify={{ canCreate, canUpdate }} />}</div>;
};
