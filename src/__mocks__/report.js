export const mockReports = [
	{
		id: "1",
		index: 0,
		startTime: new Date("2023-08-24"),
		endTime: new Date("2023-08-25"),
		content: "Report content",
		reportBy: {
			id: "1",
			fullName: "User 1",
		},
	},
	{
		id: "2",
		index: 1,
		startTime: new Date("2023-08-25"),
		endTime: new Date("2023-09-02"),
		reportBy: {
			id: "1",
			fullName: "User 1",
		},
	},
	{
		id: "3",
		index: 2,
		startTime: new Date("2023-09-05"),
		endTime: new Date("2023-09-10"),
		reportBy: {
			id: "1",
			fullName: "User 1",
		},
	},
];
