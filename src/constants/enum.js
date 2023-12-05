export const TeamRequestStatus = {
  pending: 0,
  approved: 1,
  denied: 2,
};

export const TaskStatus = {
  new: 0,
  inProgress: 1,
  pending: 2,
  completed: 3,
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
  "Bị từ Chối",
  "Đã duyệt",
  "Đang tiến hành",
  "Đã huỷ",
  "Hoàn thành",
];

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

export const eTaskStatus = {
  New: 0,
  InProgress: 1,
  Pending: 2,
  NotAchived: 3,
  Completed: 4,
};

export const eTaskLabels = [
  "Mới tạo",
  "Đang tiến hành",
  "Chờ duyệt",
  "Không hoàn thành",
  "Hoàn thành",
];

export const eTaskColors = ["#BEBB6D", "#FBD305", "#FF0000", "#FF0000", "#29CB00"];

export const EReport = {
  Uncomplete: 0,
  Complete: 1,
  NotAchieved: 2,
};

export const ReportMap = {
  [EReport.Uncomplete]: {
    color: "text-red-500",
    label: "Chưa hoàn thành",
  },
  [EReport.Complete]: {
    color: "text-green-500",
    label: "Hoàn thành",
  },
  [EReport.NotAchieved]: {
    color: "text-red-500",
    label: "Không đạt",
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
  LEADER_TASK_ORDER_LIST: 10,
  LEADER_TASK_PROCEDURE_LIST: 3,
  LEADER_TASK_ORDER_DETAIL_LIST: 3,
  ITEM_CATEGORY_LIST: 10,
  ITEM_LIST: 10,
  EMPLOYEES_LIST: 10,
  GROUP_LIST: 10,
  WORKER_IN_GROUP_LIST: 10,
};

export const NotificationType = {
  Order: 0,
  LeaderTask: 1,
  WorkerTask: 2,
  TaskReport: 3,
  OrderReport: 4,
};
