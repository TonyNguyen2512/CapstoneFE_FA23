import { TaskStatus } from "./enum";
import logoUrlBig from '../assets/images/logo.png';
import logoUrlMedium from '../assets/images/logo-256.png';
import logoUrl from '../assets/images/logo-128.png';

export { logoUrlBig, logoUrlMedium, logoUrl };

export const roles = {
	ADMIN: "Admin",
	FACTORY: "Factory",
	MANAGER: "Manager",
	WORKER: "Worker",
};

export const ALL_PERMISSIONS = {
	accounts: {
		view: "accounts.view",
		create: "accounts.create",
		update: "accounts.update",
		sider: "accounts.sider",
	},
	orders: {
		view: "orders.view",
		create: "orders.create",
		update: "orders.update",
		sider: "orders.sider",
	},
	quotes: {
		view: "quotes.view",
		create: "quotes.create",
		update: "quotes.update",
		sider: "quotes.sider",
	},
	//
	materials: {
		view: "materials.view",
		create: "materials.create",
		update: "materials.update",
		sider: "materials.sider",
	},
	materialTypes: {
		view: "materialTypes.view",
		create: "materialTypes.create",
		update: "materialTypes.update",
		sider: "materialTypes.sider",
	},
	items: {
		view: "items.view",
		create: "items.create",
		update: "items.update",
		sider: "items.sider",
	},
	// itemTypes: {
	// 	view: "itemTypes.view",
	// 	create: "itemTypes.create",
	// 	update: "itemTypes.update",
	// 	sider: "itemTypes.sider",
	// },
	employees: {
		view: "employees.view",
		create: "employees.create",
		update: "employees.update",
		sider: "employees.sider",
	},
	groups: {
		view: "groups.view",
		create: "groups.create",
		update: "groups.update",
		sider: "groups.sider",
	},
	managersTasks: {
		view: "managersTasks.view",
		create: "managersTasks.create",
		update: "managersTasks.update",
		sider: "managersTasks.sider",
	},
	managersReports: {
		view: "managersReports.view",
		create: "managersReports.create",
		update: "managersReports.update",
		sider: "managersReports.sider",
	},
	//
	workers: {
		view: "workers.view",
		create: "workers.create",
		update: "workers.update",
		sider: "workers.sider",
	},
	workersTasks: {
		view: "workersTasks.view",
		create: "workersTasks.create",
		update: "workersTasks.update",
		sider: "workersTasks.sider",
	},
	workersReports: {
		view: "workersReports.view",
		create: "workersReports.create",
		update: "workersReports.update",
		sider: "workersReports.sider",
	},
	//
	tasks: {
		view: "tasks.view",
		create: "tasks.create",
		update: "tasks.update",
		sider: "tasks.sider",
	},
	reports: {
		view: "reports.view",
		create: "reports.create",
		update: "reports.update",
		sider: "reports.sider",
	},
};

export const USER_PERMISSIONS = {
	[roles.ADMIN]: [
		// ACCOUNTS
		ALL_PERMISSIONS.accounts.sider,
		ALL_PERMISSIONS.accounts.view,
		ALL_PERMISSIONS.accounts.create,
		ALL_PERMISSIONS.accounts.update,
		// ORDERS
		ALL_PERMISSIONS.orders.sider,
		ALL_PERMISSIONS.orders.view,
		ALL_PERMISSIONS.orders.create,
		ALL_PERMISSIONS.orders.update,
		// QUOTES
		ALL_PERMISSIONS.quotes.sider,
		ALL_PERMISSIONS.quotes.view,
		ALL_PERMISSIONS.quotes.create,
		ALL_PERMISSIONS.quotes.update,
	],
	[roles.FACTORY]: [
		// QUOTES
		ALL_PERMISSIONS.quotes.sider,
		ALL_PERMISSIONS.quotes.view,
		ALL_PERMISSIONS.quotes.create,
		ALL_PERMISSIONS.quotes.update,
		// materials
		ALL_PERMISSIONS.materials.sider,
		ALL_PERMISSIONS.materials.view,
		ALL_PERMISSIONS.materials.create,
		ALL_PERMISSIONS.materials.update,
		// materialTypes
		ALL_PERMISSIONS.materialTypes.sider,
		ALL_PERMISSIONS.materialTypes.view,
		ALL_PERMISSIONS.materialTypes.create,
		ALL_PERMISSIONS.materialTypes.update,
		// items
		ALL_PERMISSIONS.items.sider,
		ALL_PERMISSIONS.items.view,
		ALL_PERMISSIONS.items.create,
		ALL_PERMISSIONS.items.update,
		// itemTypes
		// ALL_PERMISSIONS.itemTypes.sider,
		// ALL_PERMISSIONS.itemTypes.view,
		// ALL_PERMISSIONS.itemTypes.create,
		// ALL_PERMISSIONS.itemTypes.update,
		// employees
		ALL_PERMISSIONS.employees.sider,
		ALL_PERMISSIONS.employees.view,
		ALL_PERMISSIONS.employees.create,
		ALL_PERMISSIONS.employees.update,
		// groups
		ALL_PERMISSIONS.groups.sider,
		ALL_PERMISSIONS.groups.view,
		ALL_PERMISSIONS.groups.create,
		ALL_PERMISSIONS.groups.update,
		// managersTasks
		ALL_PERMISSIONS.managersTasks.sider,
		ALL_PERMISSIONS.managersTasks.view,
		ALL_PERMISSIONS.managersTasks.create,
		ALL_PERMISSIONS.managersTasks.update,
		// managersReports
		ALL_PERMISSIONS.managersReports.sider,
		ALL_PERMISSIONS.managersReports.view,
		ALL_PERMISSIONS.managersReports.create,
		ALL_PERMISSIONS.managersReports.update,
	],
	[roles.MANAGER]: [
		// workers
		ALL_PERMISSIONS.workers.sider,
		ALL_PERMISSIONS.workers.view,
		ALL_PERMISSIONS.workers.create,
		ALL_PERMISSIONS.workers.update,
		// workersTasks
		ALL_PERMISSIONS.workersTasks.sider,
		ALL_PERMISSIONS.workersTasks.view,
		ALL_PERMISSIONS.workersTasks.create,
		ALL_PERMISSIONS.workersTasks.update,
		// workersReports
		ALL_PERMISSIONS.workersReports.sider,
		ALL_PERMISSIONS.workersReports.view,
		ALL_PERMISSIONS.workersReports.create,
		ALL_PERMISSIONS.workersReports.update,
	],
	[roles.WORKER]: [
		// tasks
		ALL_PERMISSIONS.tasks.sider,
		ALL_PERMISSIONS.tasks.view,
		ALL_PERMISSIONS.tasks.create,
		ALL_PERMISSIONS.tasks.update,
		// reports
		ALL_PERMISSIONS.reports.sider,
		ALL_PERMISSIONS.reports.view,
		ALL_PERMISSIONS.reports.create,
		ALL_PERMISSIONS.reports.update,
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
