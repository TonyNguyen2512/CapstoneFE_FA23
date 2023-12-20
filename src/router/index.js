import { createBrowserRouter } from "react-router-dom";
import routes from "../constants/routes";
import { LoginPage } from "../pages/login";
import { RegisterAccountPage } from "../pages/register";
import { Dashboard } from "../layouts/dashboard";
import { AccountListPage } from "../pages/accounts/list";
import RootRoute from "./RootRoute";
import PageNotFound from "../pages/error/404";
import OrderReportListPage from "../pages/report/orderReport/list";
import { HomePage } from "../pages/home";
import { MaterialListPage } from "../pages/materials/list";
import { MaterialTypeListPage } from "../pages/material-types/list";
import { ItemListPage } from "../pages/items/list";
import { WorkerTaskListPage } from "../pages/tasks/workerTask/list";
import { LeaderTaskListPage } from "../pages/tasks/leaderTask/list";
import { LeaderTaskDetailsPage } from "../pages/tasks/leaderTask/details";
import { WorkerTaskDetailsPage } from "../pages/tasks/workerTask/details";
import { OrderListPage } from "../pages/orders/list";
import OrderDetailPage from "../pages/orders/detail";
import { ItemCategoryListPage } from "../pages/item-categories/list";
import { GroupListPage } from "../pages/group/list";
import GroupDetailPage from "../pages/group/detail";
import OrderReportDetailPage from "../pages/report/orderReport/detail";
import { ProcedureListPage } from "../pages/procedures/list";
import { StepListPage } from "../pages/steps/list";
import { QuoteListPage } from "../pages/quotes/list";
import QuoteDetailPage from "../pages/quotes/detail";
import { EmployeeListPage } from "../pages/employee/list";
import ProfilePage from "../pages/profile";
import { LeaderTaskOrderDetailsPage } from "../pages/tasks/leaderTask/details/components/orderDetail";
import { TaskReportList } from "../pages/report/taskReport/list/components/TaskReportList";
import { LeaderReportList } from "../pages/report/leaderReport/list/components/LeaderReportList";
import LeaderReportDetailPage from "../pages/report/leaderReport/detail";
import { GroupLogListPage } from "../pages/logs/GroupLog/list";
import MaterialLogModal from "../pages/logs/MateriaLog/components/MaterialLogModal";
import { ItemLogListPage } from "../pages/logs/ItemLog";
import TaskReportDetailPage from "../pages/report/taskReport/detail";
import AdminReportListPage from "../pages/report/adminReport/list";
import AdminReportDetailPage from "../pages/report/adminReport/detail";
import { WorkerListPage } from "../pages/workers/list";
import { WorkerListModal } from "../pages/workers/components/WorkerListModal";
import { DetailListModal } from "../pages/group/detail/components/DetailListModal";

export const router = createBrowserRouter([
  {
    path: routes.root,
    element: <RootRoute />,
    errorElement: <PageNotFound />,
    children: [
      {
        path: routes.login,
        element: <LoginPage />,
      },
      {
        path: routes.register,
        element: <RegisterAccountPage />,
      },
      {
        path: routes.dashboard.root,
        element: <Dashboard />,
        children: [
          {
            path: routes.dashboard.home,
            element: <HomePage />,
          },
          {
            path: routes.dashboard.profile,
            element: <ProfilePage />,
          },
          {
            path: routes.dashboard.accounts,
            element: <AccountListPage />,
          },
          {
            path: routes.dashboard.orders,
            element: <OrderListPage />,
          },
          {
            path: `${routes.dashboard.orders}/:id/${routes.dashboard.taskOrderDetails}/:orderDetailId`,
            element: <LeaderTaskOrderDetailsPage />,
          },

          {
            path: `${routes.dashboard.orders}/:id/${routes.dashboard.taskOrderDetails}/:orderDetailId/${routes.dashboard.workersTasks}/:leaderTaskId`,
            element: <WorkerTaskDetailsPage />,
          },
          {
            path: `${routes.dashboard.orders}/:id/${routes.dashboard.workersTasks}/:leaderTaskId`,
            element: <WorkerTaskDetailsPage />,
          },
          {
            path: `${routes.dashboard.orders}/:id`,
            element: <OrderDetailPage />,
          },
          {
            path: routes.dashboard.quotes,
            element: <QuoteListPage />,
          },
          {
            path: `${routes.dashboard.quotes}/:id`,
            element: <QuoteDetailPage />,
          },
          {
            path: routes.dashboard.materials,
            element: <MaterialListPage />,
          },
          {
            path: routes.dashboard.materialTypes,
            element: <MaterialTypeListPage />,
          },
          {
            path: routes.dashboard.items,
            element: <ItemListPage />,
          },
          {
            path: routes.dashboard.procedures,
            element: <ProcedureListPage />,
          },
          {
            path: routes.dashboard.steps,
            element: <StepListPage />,
          },
          {
            path: routes.dashboard.itemCategories,
            element: <ItemCategoryListPage />,
          },
          //
          {
            path: routes.dashboard.workersTasks,
            element: <WorkerTaskListPage />,
          },
          {
            path: `${routes.dashboard.workersTasks}/:leaderTaskId`,
            element: <WorkerTaskDetailsPage />,
          },
          {
            path: routes.dashboard.managersTasks,
            element: <LeaderTaskListPage />,
          },
          {
            path: `${routes.dashboard.managersTasks}/:id`,
            element: <LeaderTaskDetailsPage />,
          },
          {
            path: `${routes.dashboard.managersTasks}/:id/${routes.dashboard.taskOrderDetails}/:orderDetailId`,
            element: <LeaderTaskOrderDetailsPage />,
          },
          {
            path: `${routes.dashboard.managersTasks}/:id/${routes.dashboard.taskOrderDetails}/:orderDetailId/${routes.dashboard.workersTasks}/:leaderTaskId`,
            element: <WorkerTaskDetailsPage />,
          },
          {
            path: `${routes.dashboard.managersTasks}/:id/${routes.dashboard.workersTasks}/:leaderTaskId`,
            element: <WorkerTaskDetailsPage />,
          },
          {
            path: routes.dashboard.reports,
            element: <AccountListPage />,
          },
          {
            path: routes.dashboard.groups,
            element: <GroupListPage />,
          },
          {
            path: `${routes.dashboard.groups}/:id`,
            element: <GroupDetailPage />,
          },
          {
            path: `${routes.dashboard.groups}/:id/:id`,
            element: <DetailListModal />,
          },
          {
            path: `${routes.dashboard.groupsLog}`,
            element: <GroupLogListPage />,
          },
          {
            path: `${routes.dashboard.materialsLog}`,
            element: <MaterialLogModal />,
          },
          {
            path: `${routes.dashboard.itemsLog}`,
            element: <ItemLogListPage />,
          },
          {
            path: routes.dashboard.orderReports,
            element: <OrderReportListPage />,
          },
          {
            path: `${routes.dashboard.orderReports}/:id`,
            element: <OrderReportDetailPage />,
          },
          {
            path: routes.dashboard.taskReports,
            element: <TaskReportList />,
          },
          {
            path: `${routes.dashboard.taskReports}/:id`,
            element: <TaskReportDetailPage />,
          },
          {
            path: routes.dashboard.adminReports,
            element: <AdminReportListPage />,
          },
          {
            path: `${routes.dashboard.adminReports}/:id`,
            element: <AdminReportDetailPage />,
          },
          {
            path: routes.dashboard.leaderReports,
            element: <LeaderReportList />,
          },
          {
            path: `${routes.dashboard.leaderReports}/:id`,
            element: <LeaderReportDetailPage />,
          },
          {
            path: routes.dashboard.employees,
            element: <EmployeeListPage />,
          },
          {
            path: `${routes.dashboard.employees}/:id`,
            // element: <OrderReportDetailPage />,
          },
          {
            path: routes.dashboard.workers,
            element: <WorkerListPage />,
          },
          {
            path: `${routes.dashboard.workers}/:id`,
            element: <WorkerListModal />,
          },
        ],
      },
    ],
  },
]);
