import React from "react";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import QuoteList from "./components/QuoteList";

export const QuoteListPage = () => {
	const permissions = usePermissions();
	const canView = permissions?.includes(ALL_PERMISSIONS.accounts.view);

	return <div>{canView && <QuoteList />}</div>;
};
