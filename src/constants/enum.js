export const TeamRequestStatus = {
	pending: 0,
	approved: 1,
	denied: 2,
};

export const TaskStatus = {
	new: 0,
	inProgress: 1,
	completed: 2,
};

export const ReportFeedbackStatus = {
	passed: 0,
	notPassed: 1,
};

export const OrderStatus = {
	Pending: 0,
	Request: 1,
	Reject: 2,
	Approve: 3,
	InProgress: 4,
	Cancel: 5,
	Completed: 6
};

export const orderLabels = [
	'Chờ báo giá',
	'Chờ duyệt',
	'Bị từ Chối',
	'Đã duyệt',
	'Đang tiến hành',
	'Đã huỷ',
	'Hoàn thành',
]

export const orderColors = [
	'#BEBB6D',
	'#FBD305',
	'#FF0000',
	'#7987FF',
	'#CB7A00',
	'#FF0000',
	'#29CB00',
]

export const modalModes = {
	CREATE: "1",
	UPDATE: "2",
	DETAIL: "3"
}