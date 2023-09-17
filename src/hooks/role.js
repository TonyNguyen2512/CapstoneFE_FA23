import { useContext } from "react";
import { UserContext } from "../providers/user";

export const useRole = () => {
	const { user } = useContext(UserContext);
	return user?.role;
};
