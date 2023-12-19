import {
  SupplyLabel,
  SupplyStatus,
  ETaskMap,
  wTaskMap,
  ETaskStatus,
  TaskStatus,
  TaskMap,
  OrderReportStatus,
  OrderReportStatusLabel,
} from "./enum";
import logoUrlBig from "../assets/images/logo.png";
import logoUrlMedium from "../assets/images/logo-256.png";
import logoUrl from "../assets/images/logo-128.png";

export { logoUrlBig, logoUrlMedium, logoUrl };

export const roles = {
  ADMIN: "Admin",
  FOREMAN: "Foreman",
  LEADER: "Leader",
  WORKER: "Worker",
};

export const ROLE_MAP = {
  [roles.ADMIN]: "Quản trị viên",
  [roles.FOREMAN]: "Quản đốc",
  [roles.LEADER]: "Tổ trưởng",
  [roles.WORKER]: "Công nhân",
};

export const ALL_PERMISSIONS = {
  dashboard: {
    view: "dashboard.view",
    create: "dashboard.create",
    update: "dashboard.update",
    sider: "dashboard.sider",
  },
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
  procedures: {
    view: "procedures.view",
    create: "procedures.create",
    update: "procedures.update",
    sider: "procedures.sider",
  },
  steps: {
    view: "steps.view",
    create: "steps.create",
    update: "steps.update",
    sider: "steps.sider",
  },
  itemCategories: {
    view: "itemCategories.view",
    create: "itemCategories.create",
    update: "itemCategories.update",
    sider: "itemCategories.sider",
  },
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
  groupsLog: {
    view: "groupsLog.view",
    create: "groupsLog.create",
    update: "groupsLog.update",
    sider: "groupsLog.sider",
  },
  materialLog: {
    view: "materialLog.view",
    create: "materialLog.create",
    update: "materialLog.update",
    sider: "materialLog.sider",
  },
  itemLog: {
    view: "itemLog.view",
    create: "itemLog.create",
    update: "itemLog.update",
    sider: "itemLog.sider",
  },
  leadersTasks: {
    view: "leadersTasks.view",
    create: "leadersTasks.create",
    update: "leadersTasks.update",
    sider: "leadersTasks.sider",
  },
  leadersReports: {
    view: "leadersReports.view",
    create: "leadersReports.create",
    update: "leadersReports.update",
    sider: "leadersReports.sider",
  },
  orderReports: {
    view: "orderReports.view",
    create: "orderReports.create",
    update: "orderReports.update",
    sider: "orderReports.sider",
  },
  taskReports: {
    view: "taskReports.view",
    create: "taskReports.create",
    update: "taskReports.update",
    sider: "taskReports.sider",
  },
  leaderReports: {
    view: "leaderReports.view",
    create: "leaderReports.create",
    update: "leaderReports.update",
    sider: "leaderReports.sider",
  },
  adminReports: {
    view: "adminReports.view",
    create: "adminReports.create",
    update: "adminReports.update",
    sider: "adminReports.sider",
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
  //
  tasks: {
    view: "tasks.view",
    create: "tasks.create",
    update: "tasks.update",
    sider: "tasks.sider",
  },
};

export const USER_PERMISSIONS = {
  [roles.ADMIN]: [
    // DASHBOARD
    ALL_PERMISSIONS.dashboard.sider,
    ALL_PERMISSIONS.dashboard.view,
    // ACCOUNTS
    ALL_PERMISSIONS.adminReports.sider,
    ALL_PERMISSIONS.adminReports.view,
    ALL_PERMISSIONS.adminReports.create,
    ALL_PERMISSIONS.adminReports.update,
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
    // procedures
    ALL_PERMISSIONS.procedures.sider,
    ALL_PERMISSIONS.procedures.view,
    ALL_PERMISSIONS.procedures.create,
    ALL_PERMISSIONS.procedures.update,
    // steps
    ALL_PERMISSIONS.steps.sider,
    ALL_PERMISSIONS.steps.view,
    ALL_PERMISSIONS.steps.create,
    ALL_PERMISSIONS.steps.update,
    // item categories
    ALL_PERMISSIONS.itemCategories.sider,
    ALL_PERMISSIONS.itemCategories.view,
    ALL_PERMISSIONS.itemCategories.create,
    ALL_PERMISSIONS.itemCategories.update,
    // // employees
    // ALL_PERMISSIONS.employees.sider,
    // ALL_PERMISSIONS.employees.view,
    // ALL_PERMISSIONS.employees.create,
    // ALL_PERMISSIONS.employees.update,
    // groups
    ALL_PERMISSIONS.groups.sider,
    ALL_PERMISSIONS.groups.view,
    ALL_PERMISSIONS.groups.create,
    ALL_PERMISSIONS.groups.update,
    // groupsLog
    ALL_PERMISSIONS.groupsLog.sider,
    ALL_PERMISSIONS.groupsLog.view,
    ALL_PERMISSIONS.groupsLog.create,
    ALL_PERMISSIONS.groupsLog.update,
    // materialLog
    ALL_PERMISSIONS.materialLog.sider,
    ALL_PERMISSIONS.materialLog.view,
    ALL_PERMISSIONS.materialLog.create,
    ALL_PERMISSIONS.materialLog.update,
    // itemLog
    ALL_PERMISSIONS.itemLog.sider,
    ALL_PERMISSIONS.itemLog.view,
    ALL_PERMISSIONS.itemLog.create,
    ALL_PERMISSIONS.itemLog.update,
    // // leadersTasks
    // ALL_PERMISSIONS.leadersTasks.sider,
    // ALL_PERMISSIONS.leadersTasks.view,
    // ALL_PERMISSIONS.leadersTasks.create,
    // ALL_PERMISSIONS.leadersTasks.update,
    // leadersReports
    ALL_PERMISSIONS.leadersReports.sider,
    ALL_PERMISSIONS.leadersReports.view,
    ALL_PERMISSIONS.leadersReports.create,
    ALL_PERMISSIONS.leadersReports.update,
    // // order reports
    // ALL_PERMISSIONS.orderReports.sider,
    // ALL_PERMISSIONS.orderReports.view,
    // ALL_PERMISSIONS.orderReports.create,
    // ALL_PERMISSIONS.orderReports.update,
    // // task reports
    // ALL_PERMISSIONS.taskReports.sider,
    // ALL_PERMISSIONS.taskReports.view,
    // ALL_PERMISSIONS.taskReports.create,
    // ALL_PERMISSIONS.taskReports.update,
    // groupsLog
    ALL_PERMISSIONS.groupsLog.sider,
    ALL_PERMISSIONS.groupsLog.view,
    ALL_PERMISSIONS.groupsLog.create,
    ALL_PERMISSIONS.groupsLog.update,
    // materialLog
    ALL_PERMISSIONS.materialLog.sider,
    ALL_PERMISSIONS.materialLog.view,
    ALL_PERMISSIONS.materialLog.create,
    ALL_PERMISSIONS.materialLog.update,
    // itemLog
    ALL_PERMISSIONS.itemLog.sider,
    ALL_PERMISSIONS.itemLog.view,
    ALL_PERMISSIONS.itemLog.create,
    ALL_PERMISSIONS.itemLog.update,
  ],
  [roles.FOREMAN]: [
    // DASHBOARD
    ALL_PERMISSIONS.dashboard.sider,
    ALL_PERMISSIONS.dashboard.view,
    // ACCOUNTS
    ALL_PERMISSIONS.accounts.view,
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
    // procedures
    ALL_PERMISSIONS.procedures.sider,
    ALL_PERMISSIONS.procedures.view,
    ALL_PERMISSIONS.procedures.create,
    ALL_PERMISSIONS.procedures.update,
    // steps
    ALL_PERMISSIONS.steps.sider,
    ALL_PERMISSIONS.steps.view,
    ALL_PERMISSIONS.steps.create,
    ALL_PERMISSIONS.steps.update,
    // item categories
    ALL_PERMISSIONS.itemCategories.sider,
    ALL_PERMISSIONS.itemCategories.view,
    ALL_PERMISSIONS.itemCategories.create,
    ALL_PERMISSIONS.itemCategories.update,
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
    // groupsLog
    ALL_PERMISSIONS.groupsLog.sider,
    ALL_PERMISSIONS.groupsLog.view,
    ALL_PERMISSIONS.groupsLog.create,
    ALL_PERMISSIONS.groupsLog.update,
    // materialLog
    ALL_PERMISSIONS.materialLog.sider,
    ALL_PERMISSIONS.materialLog.view,
    ALL_PERMISSIONS.materialLog.create,
    ALL_PERMISSIONS.materialLog.update,
    // itemLog
    ALL_PERMISSIONS.itemLog.sider,
    ALL_PERMISSIONS.itemLog.view,
    ALL_PERMISSIONS.itemLog.create,
    ALL_PERMISSIONS.itemLog.update,
    // leadersTasks
    ALL_PERMISSIONS.leadersTasks.sider,
    ALL_PERMISSIONS.leadersTasks.view,
    ALL_PERMISSIONS.leadersTasks.create,
    ALL_PERMISSIONS.leadersTasks.update,
    // leadersReports
    ALL_PERMISSIONS.leadersReports.sider,
    ALL_PERMISSIONS.leadersReports.view,
    ALL_PERMISSIONS.leadersReports.create,
    ALL_PERMISSIONS.leadersReports.update,
    // order reports
    ALL_PERMISSIONS.orderReports.sider,
    ALL_PERMISSIONS.orderReports.view,
    ALL_PERMISSIONS.orderReports.create,
    ALL_PERMISSIONS.orderReports.update,
    // task reports
    ALL_PERMISSIONS.taskReports.sider,
    ALL_PERMISSIONS.taskReports.view,
    ALL_PERMISSIONS.taskReports.create,
    ALL_PERMISSIONS.taskReports.update,
  ],
  [roles.LEADER]: [
    // DASHBOARD
    ALL_PERMISSIONS.dashboard.sider,
    ALL_PERMISSIONS.dashboard.view,
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
    // leaderReports
    ALL_PERMISSIONS.leaderReports.sider,
    ALL_PERMISSIONS.leaderReports.view,
    ALL_PERMISSIONS.leaderReports.create,
    ALL_PERMISSIONS.leaderReports.update,
  ],
  [roles.WORKER]: [
    // DASHBOARD
    ALL_PERMISSIONS.dashboard.sider,
    ALL_PERMISSIONS.dashboard.view,
    // tasks
    ALL_PERMISSIONS.workers.sider,
    ALL_PERMISSIONS.workers.view,
    ALL_PERMISSIONS.workers.create,
    ALL_PERMISSIONS.workers.update,
    // workersTasks
    ALL_PERMISSIONS.workersTasks.sider,
    ALL_PERMISSIONS.workersTasks.view,
    ALL_PERMISSIONS.workersTasks.create,
    ALL_PERMISSIONS.workersTasks.update,
  ],
};

export const ETaskStatusOptions = [
  {
    value: ETaskStatus.New,
    label: ETaskMap[ETaskStatus.New].label,
  },
  {
    value: ETaskStatus.InProgress,
    label: ETaskMap[ETaskStatus.InProgress].label,
  },
  {
    value: ETaskStatus.Pending,
    label: ETaskMap[ETaskStatus.Pending].label,
  },
  {
    value: ETaskStatus.NotAchived,
    label: ETaskMap[ETaskStatus.NotAchived].label,
  },
  {
    value: ETaskStatus.Completed,
    label: ETaskMap[ETaskStatus.Completed].label,
  },
  // {
  //   value: ETaskStatus.Acceptance,
  //   label: ETaskMap[ETaskStatus.Acceptance].label,
  // },
];

export const WTaskStatusOptions = [
  {
    value: TaskStatus.New,
    label: TaskMap[TaskStatus.New].label,
  },
  {
    value: TaskStatus.InProgress,
    label: TaskMap[TaskStatus.InProgress].label,
  },
  {
    value: TaskStatus.Pending,
    label: TaskMap[TaskStatus.Pending].label,
  },
  {
    value: TaskStatus.Completed,
    label: TaskMap[TaskStatus.Completed].label,
  },
];

export const TaskColumnId = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  IN_APPROVE: "IN_APPROVE",
  IN_EVALUATE: "IN_EVALUATE",
  COMPLETED: "COMPLETED",
};

export const OrderStatus = {
  PENDING: 0,
  REQUEST: 1,
  REJECT: 2,
  APPROVE: 3,
  IN_PROGRESS: 4,
  CANCEL: 5,
  COMPLETED: 6,
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

export const qualityTaskOptions = [
  {
    value: 0,
    label: "Tốt",
    color: "#29CB00",
  },
  {
    value: 1,
    label: "Khá Tốt",
    color: "#BEBB6D",
  },
  {
    value: 2,
    label: "Khá",
    color: "#FBD305",
  },
  {
    value: 3,
    label: "Trung bình khá",
    color: "#CB7A00",
  },
  {
    value: 4,
    label: "Trung bình",
    color: "#FF0000",
  },
];

export const attitudeTaskOptions = [
  {
    value: 0,
    label: "Chuyên nghiệp",
    color: "#29CB00",
  },
  {
    value: 1,
    label: "Tích cực",
    color: "#BEBB6D",
  },
  {
    value: 2,
    label: "Hợp tác",
    color: "#CB7A00",
  },
  {
    value: 3,
    label: "Học hỏi",
    color: "#CB7A00",
  },
];

export const SupplyOptions = [
  {
    value: SupplyStatus.Fail,
    label: SupplyLabel[0],
  },
  {
    value: SupplyStatus.Missing,
    label: SupplyLabel[1],
  },
  // {
  //   value: SupplyStatus.AcceptByCustomer,
  //   label: SupplyLabel[2],
  // },
  // {
  //   value: SupplyStatus.RejectByCustomer,
  //   label: SupplyLabel[3],
  // },
];

export const OrderReportStatusOptions = [
  {
    value: OrderReportStatus.Uncomplete,
    label: OrderReportStatusLabel[0],
  },
  {
    value: OrderReportStatus.Complete,
    label: OrderReportStatusLabel[1],
  },
];
