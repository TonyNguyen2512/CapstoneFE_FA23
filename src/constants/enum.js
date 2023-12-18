export const TeamRequestStatus = {
  pending: 0,
  approved: 1,
  denied: 2,
};

export const TaskStatus = {
  New: 0,
  InProgress: 1,
  Pending: 2,
  Completed: 3,
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
  Completed: 6,
};

export const orderLabels = [
  "Chờ báo giá",
  "Chờ duyệt",
  "Huỷ báo giá",
  "Đã duyệt",
  "Đang tiến hành",
  "Đã huỷ",
  "Hoàn thành",
];

export const genderLabels = ["Nam", "Nữ", "Khác"];

export const orderColors = [
  "#BEBB6D",
  "#FBD305",
  "#FF0000",
  "#7987FF",
  "#CB7A00",
  "#FF0000",
  "#29CB00",
];

export const modalModes = {
  CREATE: "1",
  UPDATE: "2",
  DETAIL: "3",
};

export const ETaskStatus = {
  New: 0,
  InProgress: 1,
  Pending: 2,
  NotAchived: 3,
  Completed: 4,
};

export const wTaskStatus = {
  New: 0,
  InProgress: 1,
  Pending: 2,
  Completed: 3,
};

export const TaskMap = {
  [TaskStatus.New]: {
    color: "#BEBB6D",
    label: "Mới tạo",
  },
  [TaskStatus.InProgress]: {
    color: "#CB7A00",
    label: "Đang tiến hành",
  },
  [TaskStatus.Pending]: {
    color: "#FBD305",
    label: "Chờ duyệt",
  },
  [TaskStatus.Completed]: {
    color: "#29CB00",
    label: "Hoàn thành",
  },
};

export const ETaskMap = {
  [ETaskStatus.New]: {
    color: "#BEBB6D",
    label: "Mới tạo",
  },
  [ETaskStatus.InProgress]: {
    color: "#CB7A00",
    label: "Đang tiến hành",
  },
  [ETaskStatus.Pending]: {
    color: "#FBD305",
    label: "Chờ duyệt",
  },
  [ETaskStatus.NotAchived]: {
    color: "#FF0000",
    label: "Không hoàn thành",
  },
  [ETaskStatus.Completed]: {
    color: "#29CB00",
    label: "Hoàn thành",
  },
};

export const wTaskMap = {
  [wTaskStatus.New]: {
    color: "#BEBB6D",
    label: "Mới tạo",
  },
  [wTaskStatus.InProgress]: {
    color: "#CB7A00",
    label: "Đang tiến hành",
  },
  [wTaskStatus.Pending]: {
    color: "#FBD305",
    label: "Chờ duyệt",
  },
  [wTaskStatus.Completed]: {
    color: "#29CB00",
    label: "Hoàn thành",
  },
};
export const WReport = {
  Uncomplete: 1,
  Complete: 2,
  NotAchieved: 3,
  Achieved: 4,
  Pending: 5,
  Reject: 6,
  Approve: 7,
  Provided: 8,
};

export const TaskReportMap = {
  [WReport.Pending]: {
    color: "text-yellow-500",
    label: "Chờ duyệt",
  },
  [WReport.Reject]: {
    color: "text-red-500",
    label: "Từ chối",
  },
  [WReport.Approve]: {
    color: "text-green-500",
    label: "Duyệt",
  },
  [WReport.Provided]: {
    color: "text-blue-500",
    label: "Đã cung cấp",
  },
};
export const orderReportMap = {
  [WReport.Pending]: {
    color: "text-yellow-500",
    label: "Chờ duyệt",
  },
  [WReport.Reject]: {
    color: "text-red-500",
    label: "Từ chối",
  },
  [WReport.Approve]: {
    color: "text-green-500",
    label: "Duyệt",
  },
};

export const ReportMap = {
  [WReport.Uncomplete]: {
    color: "text-red-500",
    label: "Chưa hoàn thành",
  },
  [WReport.Complete]: {
    color: "text-green-500",
    label: "Hoàn thành",
  },
  [WReport.NotAchieved]: {
    color: "text-red-500",
    label: "Không đạt",
  },
  [WReport.Achieved]: {
    color: "text-pink-500",
    label: "Đạt",
  },
  [WReport.Pending]: {
    color: "text-yellow-500",
    label: "Chờ duyệt",
  },
  [WReport.Reject]: {
    color: "text-red-500",
    label: "Từ chối",
  },
  [WReport.Approve]: {
    color: "text-green-500",
    label: "Duyệt",
  },
  [WReport.Provided]: {
    color: "text-blue-500",
    label: "Đã cung cấp",
  },
};

export const ErrorImage =
  "https://firebasestorage.googleapis.com/v0/b/capstonebwm.appspot.com/o/Picture%2Fno_photo.jpg?alt=media&token=3dee5e48-234a-44a1-affa-92c8cc4de565&_gl=1*bxxcv*_ga*NzMzMjUwODQ2LjE2OTY2NTU2NjA.*_ga_CW55HF8NVT*MTY5ODIyMjgyNC40LjEuMTY5ODIyMzIzNy41Ny4wLjA&fbclid=IwAR0aZK4I3ay2MwA-5AyI-cqz5cGAMFcbwoAiMBHYe8TEim-UTtlbREbrCS0";

export const SupplyStatus = {
  Fail: 0,
  Missing: 1,
  AcceptByCustomer: 2,
  RejectByCustomer: 3,
};

export const SupplyLabel = [
  "Thất bại",
  "Thiếu nguyên liệu",
  "Yêu cầu từ khách hàng",
  "Khách hàng từ chối",
];

export const PageSize = {
  ACCOUNTS_LIST: 10,
  ORDER_LIST: 10,
  LEADER_TASK_ORDER_LIST: 10,
  LEADER_TASK_PROCEDURE_LIST: 3,
  LEADER_TASK_ORDER_DETAIL_LIST: 3,
  ITEM_CATEGORY_LIST: 10,
  ITEM_LIST: 10,
  EMPLOYEES_LIST: 10,
  GROUP_LIST: 10,
  WORKER_IN_GROUP_LIST: 10,
  LEADER_REPORT_LIST: 10,
  ORDER_REPORT_LIST: 10,
  LOG_GROUP_LIST: 10,
  LOG_ITEM_LIST: 10,
  LOG_MATERIAL_LIST: 10,
  STEP_LIST: 10,
  PROCEDURE_LIST: 5,
  ADMIN_REPORT_LIST: 10,
  ADMIN_REPORT_LIST: 10,
  STEP_LIST_MAX: 100000,
};

export const NotificationType = {
  Order: 0,
  LeaderTask: 1,
  WorkerTask: 2,
  TaskReport: 3,
  OrderReport: 4,
};

export const OrderReportStatus = {
  Uncomplete: 1,
  Complete: 2,
};

export const OrderReportStatusLabel = ["Thất bại", "Hoàn thành"];

export const ReportType = {
  ProgressReport: 0,
  ProblemReport: 1,
  AcceptanceReport: 2,
  OrderReport: 3,
};

export const ReportTypeMap = {
  [ReportType.ProgressReport]: {
    color: "#BEBB6D",
    label: "Tiến độ",
  },
  [ReportType.ProblemReport]: {
    color: "#CB7A00",
    label: "Vấn đề",
  },
  [ReportType.AcceptanceReport]: {
    color: "#FBD305",
    label: "Nghiệm thu",
  },
  [ReportType.OrderReport]: {
    color: "#29CB00",
    label: "Đơn hàng",
  },
};
