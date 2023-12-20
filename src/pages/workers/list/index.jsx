import React from "react";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import WorkerList from "./components/WorkerList";

export const WorkerListPage = () => {
	const permissions = usePermissions();
	const canView = permissions?.includes(ALL_PERMISSIONS.workers.view);

	return <div>{canView && <WorkerList />}</div>;
};
