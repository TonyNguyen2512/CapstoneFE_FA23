import moment from "moment/moment";
import { roles } from "../constants/app";

export const formatDate = (date, pattern) => {
	const result = moment(date).format(pattern);
	return result;
};

export const getRoleName = (role) => {
	switch (role) {
		case roles.ADMIN:
			return "Admin";
		case roles.WORKER:
			return "Sinh viên";
		case roles.FACTORY:
			return "Giáo viên";
		default:
			return "";
	}
};
