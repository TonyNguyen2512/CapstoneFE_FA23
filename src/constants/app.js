import { SupplyLabel, SupplyStatus, TaskStatus } from "./enum";
import logoUrlBig from "../assets/images/logo.png";
import logoUrlMedium from "../assets/images/logo-256.png";
import logoUrl from "../assets/images/logo-128.png";

export { logoUrlBig, logoUrlMedium, logoUrl };

export const roles = {
  ADMIN: "Admin",
  FACTORY: "Factory",
  FOREMAN: "Foreman",
  LEADER: "Leader",
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
  squads: {
    view: "squads.view",
    create: "squads.create",
    update: "squads.update",
    sider: "squads.sider",
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
  [roles.FOREMAN]: [
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
    // workers squad
    ALL_PERMISSIONS.squads.sider,
    ALL_PERMISSIONS.squads.view,
    ALL_PERMISSIONS.squads.create,
    ALL_PERMISSIONS.squads.update,
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
  ],
  [roles.LEADER]: [
    // workers squad
    ALL_PERMISSIONS.squads.sider,
    ALL_PERMISSIONS.squads.view,
    ALL_PERMISSIONS.squads.create,
    ALL_PERMISSIONS.squads.update,
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
    value: TaskStatus.pending,
    label: "Chờ duyệt",
  },
  {
    value: TaskStatus.inEvaluete,
    label: "Đánh giá",
  },
  {
    value: TaskStatus.completed,
    label: "Đã hoàn thành",
  },
];

export const TaskColumnId = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  IN_APPROVE: "IN_APPROVE",
  IN_EVALUATE: "IN_EVALUATE",
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
  {
    value: SupplyStatus.AcceptByCustomer,
    label: SupplyLabel[2],
  },
  {
    value: SupplyStatus.RejectByCustomer,
    label: SupplyLabel[3],
  },
]