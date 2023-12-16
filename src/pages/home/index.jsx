import React from "react";
import { ALL_PERMISSIONS } from "../../constants/app";
import { usePermissions } from "../../hooks/permission";
import Home from "./components/Home";

export const HomePage = () => {
	const permissions = usePermissions();
	const canView = permissions?.includes(ALL_PERMISSIONS.dashboard?.view);

	return <div>{canView && <Home />}</div>;
};
