import React from "react";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import OrderList from "./components/OrderList";

export const OrderListPage = () => {
	const permissions = usePermissions();
	const canView = permissions?.includes(ALL_PERMISSIONS.accounts.view);

	return <div>{canView && <OrderList />}</div>;
};
