import { TaskStatus } from "./enum";

export const roles = {
	ADMIN: "Admin",
	FACTORY: "Factory",
	LEADER: "Leader",
	WORKER: "Worker",
};

export const ALL_PERMISSIONS = {
	account: {
		view: "account.view",
		create: "account.create",
		update: "account.update",
		sider: "account.sider",
	},
	class: {
		view: "class.view",
		create: "class.create",
		update: "class.update",
		delete: "class.delete",
		enroll: "class.enroll",
		settings: "class.settings",
		sider: "class.sider",
	},
	course: {
		view: "course.view",
		create: "course.create",
		update: "course.update",
		delete: "course.delete",
		sider: "course.sider",
	},
	project: {
		view: "project.view",
		create: "project.create",
		update: "project.update",
		delete: "project.delete",
		sider: "project.sider",
	},
	team: {
		view: "team.view",
		create: "team.create",
		update: "team.update",
		delete: "team.delete",
		sider: "team.sider",
	},
	task: {
		view: "task.view",
		create: "task.create",
		update: "task.update",
		delete: "task.delete",
	},
	report: {
		view: "report.view",
		sider: "report.sider",
	},
	semester: {
		sider: "semester.sider",
		view: "semester.view",
		create: "semester.create",
		update: "semester.update",
		delete: "semester.delete",
	},
};

export const USER_PERMISSIONS = {
	[roles.ADMIN]: [
		// ACCOUNT
		ALL_PERMISSIONS.account.sider,
		ALL_PERMISSIONS.account.view,
		ALL_PERMISSIONS.account.create,
		ALL_PERMISSIONS.account.update,
		// CLASS
		ALL_PERMISSIONS.class.sider,
		ALL_PERMISSIONS.class.view,
		ALL_PERMISSIONS.class.create,
		ALL_PERMISSIONS.class.update,
		ALL_PERMISSIONS.class.delete,
		ALL_PERMISSIONS.class.settings,
		// COURSE
		ALL_PERMISSIONS.course.sider,
		ALL_PERMISSIONS.course.view,
		ALL_PERMISSIONS.course.create,
		ALL_PERMISSIONS.course.update,
		ALL_PERMISSIONS.course.delete,
		// PROJECT
		ALL_PERMISSIONS.project.view,
		ALL_PERMISSIONS.project.create,
		ALL_PERMISSIONS.project.update,
		ALL_PERMISSIONS.project.delete,
		//TEAM
		ALL_PERMISSIONS.team.view,
		ALL_PERMISSIONS.team.create,
		ALL_PERMISSIONS.team.update,
		ALL_PERMISSIONS.team.delete,
		//TASK
		ALL_PERMISSIONS.task.view,
		ALL_PERMISSIONS.task.create,
		ALL_PERMISSIONS.task.update,
		ALL_PERMISSIONS.task.delete,
		// SEMESTER
		ALL_PERMISSIONS.semester.sider,
		ALL_PERMISSIONS.semester.view,
		ALL_PERMISSIONS.semester.create,
		ALL_PERMISSIONS.semester.update,
		ALL_PERMISSIONS.semester.delete,
	],
	[roles.FACTORY]: [
		// CLASS
		ALL_PERMISSIONS.class.sider,
		ALL_PERMISSIONS.class.view,
		ALL_PERMISSIONS.class.update,
		ALL_PERMISSIONS.class.delete,
		ALL_PERMISSIONS.class.settings,
		// COURSE
		ALL_PERMISSIONS.course.view,
		// PROJECT
		ALL_PERMISSIONS.project.view,
		ALL_PERMISSIONS.project.create,
		ALL_PERMISSIONS.project.update,
		ALL_PERMISSIONS.project.delete,
		//TEAM
		ALL_PERMISSIONS.team.view,
		//TASK
		ALL_PERMISSIONS.task.view,
		// REPORT
		ALL_PERMISSIONS.report.sider,
		ALL_PERMISSIONS.report.view,
	],
	[roles.WORKER]: [
		// CLASS
		ALL_PERMISSIONS.class.sider,
		ALL_PERMISSIONS.class.view,
		ALL_PERMISSIONS.class.enroll,
		// COURSE
		ALL_PERMISSIONS.course.view,
		// PROJECT
		ALL_PERMISSIONS.project.sider,
		ALL_PERMISSIONS.project.view,
		//TEAM
		ALL_PERMISSIONS.team.sider,
		ALL_PERMISSIONS.team.view,
		ALL_PERMISSIONS.team.create,
		ALL_PERMISSIONS.team.update,
		ALL_PERMISSIONS.team.delete,
		// TASK
		ALL_PERMISSIONS.task.view,
		ALL_PERMISSIONS.task.create,
		ALL_PERMISSIONS.task.update,
		ALL_PERMISSIONS.task.delete,
	],
};

export const taskStatusOptions = [
	{
		value: TaskStatus.new,
		label: "Cần làm",
	},
	{
		value: TaskStatus.inProgress,
		label: "Đang làm",
	},
	{
		value: TaskStatus.completed,
		label: "Đã hoàn thành",
	},
];

export const TaskColumnId = {
	TODO: "TODO",
	IN_PROGRESS: "IN_PROGRESS",
	COMPLETED: "COMPLETED",
};

export const SemesterTypeOptions = [
	{
		label: "Spring",
		value: "Spring",
	},
	{
		label: "Summer",
		value: "Summer",
	},
	{
		label: "Fall",
		value: "Fall",
	},
	{
		label: "Winter",
		value: "Winter",
	},
];

export const SemesterTypeRanges = {
	Spring: {
		startMonth: 0,
		startDay: 1,
		endMonth: 2,
		endDay: 31,
	}, // Jan 1st to March 31th
	Summer: {
		startMonth: 3,
		startDay: 1,
		endMonth: 5,
		endDay: 30,
	}, // April 1st to June 30st
	Fall: {
		startMonth: 6,
		startDay: 1,
		endMonth: 8,
		endDay: 30,
	}, // July 1st to September 30th
	Winter: {
		startMonth: 9,
		startDay: 1,
		endMonth: 11,
		endDay: 31,
	}, // October 1st to December 31th
};
