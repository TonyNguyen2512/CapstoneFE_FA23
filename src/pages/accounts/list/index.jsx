import React from "react";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import AccountList from "./components/AccountList";

export const AccountListPage = () => {
	const permissions = usePermissions();
	const canView = permissions?.includes(ALL_PERMISSIONS.accounts.view);

	return <div>{canView && <AccountList />}</div>;
};
