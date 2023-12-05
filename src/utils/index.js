import moment from "moment/moment";
import { roles } from "../constants/app";
import routes from "../constants/routes";
import dayjs from "dayjs";
import { eTaskColors, eTaskLabels } from "../constants/enum";

export const formatDate = (date, pattern) => {
	let result = "";
	if (date) {
		result = moment(date).format(pattern);
	}
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
			return "Quản trị viên";
		case roles.FOREMAN:
			return "Quản đốc";
		case roles.LEADER:
			return "Tổ trưởng";
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

export const formatNum = (value) => {
	return (value || 0) * 1;
}

export const dateSort = (dateA, dateB) => {
	return dayjs(dateA).isAfter(dayjs(dateB)) ? 1 : dayjs(dateA).isBefore(dayjs(dateB)) ? -1 : 0;
}

export const formatMoney = (money) => {
	if (!money) return null;
	return money.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
}

export const getEStatusName = (status) => {
	return eTaskLabels[status] || "Không Xác Định";
};

export const getEStatusColor = (status) => {
	return eTaskColors[status] || "#FF0000";
};

export const handleDownloadFile = async (url, filename, message) => {
	if (!url) message.warning("Không có bản vẽ");
	try {
		var fileName = formatDate(new Date(), "DDMMYYYYHHmmss") + "_" + filename + ".png";
		var downloadFile = new Blob([url], { type: "image/jpeg (.jpg, .jpeg, .jfif, .pjpeg, .pjp)" });
		var fileURL = window.URL.createObjectURL(downloadFile);
		var a = document.createElement("a");
		a.download = fileName;
		a.href = fileURL;
		a.click();
	} catch (err) {
		console.log(err);
	}
}