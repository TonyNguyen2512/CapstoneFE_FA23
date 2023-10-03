import moment from "moment/moment";
import { roles } from "../constants/app";
import routes from "../constants/routes";

export const formatDate = (date, pattern) => {
	const result = moment(date).format(pattern);
	return result;
};

export const getTitle = (route) => {
	switch (route) {
		case routes.dashboard.home:
			return "Bảng điều khiển";
		case routes.dashboard.profile:
			return "Thông tin cá nhân";
		case routes.dashboard.statistics:
			return "Thống kê";
		default:
			return "";
	}
};

export const getRoleName = (role) => {
	switch (role) {
		case roles.ADMIN:
			return "Admin";
		case roles.FACTORY:
			return "Quản đốc";
		case roles.LEADER:
			return "Quản lý";
		case roles.WORKER:
			return "Công nhân";
		default:
			return "";
	}
};

// Number processing
const shrinkSuffix = ['', 'K', 'M', 'G', 'T'];
export const reduceNumber = (num) => {
	if (num && num > 999) {
		let count = 0;
		while (num > 999) {
			count++;
			num /= 1000;
		}
		return num + shrinkSuffix[count]
		// switch (count) {
		// 	case 1:
		// 		return num + 'K'
		// 	case 2:
		// 		return num + 'M'
		// 	case 3:
		// 		return num + 'G'
		// }
	}
	return num;
}