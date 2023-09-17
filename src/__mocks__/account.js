import { roles } from "../constants/app";

export const mockAccounts = [
	{
		id: "1",
		fullName: "Nguyen Van A",
		email: "admin@gmail.com",
		password: '123456',
		role: roles.ADMIN,
		active: true,
	},
	{
		id: "2",
		fullName: "Nguyen Van B",
		email: "factory@gmail.com",
		password: '123456',
		role: roles.FACTORY,
		active: true,
	},
	{
		id: "3",
		fullName: "Nguyen Van C",
		email: "leader@gmail.com",
		password: '123456',
		role: roles.LEADER,
		active: true,
	},
	
	{
		id: "3",
		fullName: "Nguyen Van C",
		email: "worker@gmail.com",
		password: '123456',
		role: roles.WORKER,
		active: true,
	},
];

export const mockStudents = [
	{
		id: "3",
		fullName: "Nguyễn Thanh Huyền",
		email: "huyenthanh@fpt.edu.com",
		role: roles.WORKER,
		active: true,
		team: {
			name: "Nhóm 1",
			members: [
				{
					name: "Trần Hạo Nam",
				},
				{
					name: "Bùi Văn Công",
				},
			],
		},
	},
	{
		id: "4",
		fullName: "Trần Vĩnh Phát",
		email: "phatvinh@fpt.edu.com",
		role: roles.WORKER,
		active: true,
	},
	{
		id: "5",
		fullName: "Lê Văn Vũ",
		email: "vule@fpt.edu.com",
		role: roles.WORKER,
		active: true,
	},
];
