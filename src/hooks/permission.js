import { useContext } from "react";
import { UserContext } from "../providers/user";
import { USER_PERMISSIONS } from "../constants/app";

export const usePermissions = () => {
	const { user } = useContext(UserContext);
	return USER_PERMISSIONS[user?.role];
};
