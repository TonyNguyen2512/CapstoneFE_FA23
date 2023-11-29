import React from "react";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import EmployeeList from "./components/EmployeeList";

export const EmployeeListPage = () => {
	const permissions = usePermissions();
	const canView = permissions?.includes(ALL_PERMISSIONS.employees.view);

	return <div>{canView && <EmployeeList />}</div>;
};
