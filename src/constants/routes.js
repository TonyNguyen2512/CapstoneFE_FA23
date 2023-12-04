const routes = {
  root: "/",
  login: "/login",
  register: "/register",
  dashboard: {
    root: "/dashboard",
    home: "home",
    profile: "profile",
    // admin
    accounts: "accounts",
    orders: "orders",
    quotes: "quotes", // factory
    // factory / foreman
    materials: "materials",
    materialTypes: "material-types",
    items: "items",
    procedures: "procedures",
    steps: "steps",
    itemCategories: "item-categories",
    employees: "employees",
    groups: "groups",
    managersTasks: "managers-tasks",
    managersReports: "managers-reports",
    orderReports: "order-reports",
    taskOrderDetails: "task-order-details",
    // leader / manager
    workers: "workers",
    workersTasks: "workers-tasks",
    workersReports: "workers-reports",
    // worker
    tasks: "tasks",
    // old //
    courses: "courses",
    classes: "classes",
    projects: "projects",
    teams: "teams",
    teamRequest: "team-requests",
    report: "team-report",
    semester: "semester",
    studentReport: "student-report",
    statistics: "statistics",
  },
};

export const UnauthorizedRoutes = [routes.login, routes.register];

export default routes;
