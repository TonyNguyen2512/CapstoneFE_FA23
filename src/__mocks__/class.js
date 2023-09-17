import { mockCourses } from "./course";

export const mockClasses = [
	{
		id: "1",
		name: "Summer2023_3W_1",
		startDate: new Date("2023-01-01"),
		endDate: new Date("2023-01-28"),
		instructor: {
			id: "1",
			name: "Nguyen Van A",
		},
		students: [
			{
				id: "1",
				name: "Tran Van B",
			},
			{
				id: "2",
				name: "Tran Van C",
			},
		],
		course: mockCourses[0],
		active: true,
	},
	{
		id: "2",
		name: "Summer2023_3W_2",
		startDate: new Date("2023-01-01"),
		endDate: new Date("2023-01-28"),
		instructor: {
			id: "1",
			name: "Phan Van Troi",
		},
		students: [
			{
				id: "1",
				name: "Tran Van B",
			},
			{
				id: "2",
				name: "Tran Van C",
			},
		],
		course: mockCourses[1],
		active: false,
	},
];
