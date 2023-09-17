const ApiCodes = {
	// common
	99: "Thất bại",
	100: "Thành công",
	// semester
	1: "Tên học kỳ đã tồn tại",
	2: "Ngày bắt đầu bị trùng",
	3: "Ngày kết thúc bị trùng",
	4: "Ngày bắt đầu nhỏ hơn hiện tại",
	5: "Ngày bắt đầu lớn hơn ngày kết thúc",
	1001: "Ngày bắt đầu hoặc kết thúc bị trùng với học kỳ khác",
	// project
	15: "Tên dự án đã tồn tại",
	// team
	8: "Có thành viên bị lặp",
	9: "Bạn hoặc các thành viên đăng ký khác đã có nhóm",
	20: "Chưa thể đăng ký nhóm vào lúc này",
};

export default ApiCodes;
