import {
  EveryUser,
  HourglassNull,
  ListView,
  DataUser,
  CategoryManagement,
  AdjacentItem,
  ProcessLine,
  ListOne,
  TableReport,
  DataFile,
  DocSuccess,
  History,
} from "@icon-park/react";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import routes from "../../constants/routes";
import { usePermissions } from "../../hooks/permission";
import { ALL_PERMISSIONS, logoUrl } from "../../constants/app";
import {
  BuildOutlined,
  CodeSandboxOutlined,
  FileDoneOutlined,
  FormOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const AppSider = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const permissions = usePermissions();

  const canViewDashboard = permissions?.includes(ALL_PERMISSIONS.dashboard?.sider);
  const canViewAccounts = permissions?.includes(ALL_PERMISSIONS.accounts?.sider);
  const canViewOrders = permissions?.includes(ALL_PERMISSIONS.orders?.sider);
  const canViewQuotes = permissions?.includes(ALL_PERMISSIONS.quotes?.sider);
  const canViewMaterials = permissions?.includes(ALL_PERMISSIONS.materials?.sider);
  const canViewMaterialTypes = permissions?.includes(ALL_PERMISSIONS.materialTypes?.sider);
  const canViewItems = permissions?.includes(ALL_PERMISSIONS.items?.sider);
  const canViewProcedures = permissions?.includes(ALL_PERMISSIONS.procedures?.sider);
  const canViewSteps = permissions?.includes(ALL_PERMISSIONS.procedures?.sider);
  const canViewItemCategories = permissions?.includes(ALL_PERMISSIONS.itemCategories?.sider);
  const canViewEmployees = permissions?.includes(ALL_PERMISSIONS.employees?.sider);
  const canViewGroups = permissions?.includes(ALL_PERMISSIONS.groups?.sider);
  const canViewGroupsLog = permissions?.includes(ALL_PERMISSIONS.groupsLog?.sider);
  const canViewLeadersTasks = permissions?.includes(ALL_PERMISSIONS.leadersTasks?.sider);
  const canViewLeadersReports = permissions?.includes(ALL_PERMISSIONS.leadersReports?.sider);
  const canViewWorkers = permissions?.includes(ALL_PERMISSIONS.workers?.sider);
  const canViewWorkersTasks = permissions?.includes(ALL_PERMISSIONS.workersTasks?.sider);
  const canViewWorkersReports = permissions?.includes(ALL_PERMISSIONS.workersReports?.sider);
  const canViewTasks = permissions?.includes(ALL_PERMISSIONS.tasks?.sider);
  const canViewOrderReports = permissions?.includes(ALL_PERMISSIONS.orderReports?.sider);
  const canViewLeaderReports = permissions?.includes(ALL_PERMISSIONS.leaderReports?.sider);
  const canVieAdminReports = permissions?.includes(ALL_PERMISSIONS.adminReports?.sider);

  const itemKeys = {
    DASHBOARD: "DASHBOARD",
    //
    ACCOUNTS: "MANAGE_ACCOUNTS",
    ORDERS: "MANAGE_ORDERS",
    QUOTES: "MANAGE_QUOTES",
    //
    P_MATERIALS: "P_MATERIALS",
    MATERIALS: "MANAGE_MATERIALS",
    MATERIAL_TYPES: "MANAGE_MATERIAL_TYPES",
    P_ITEMS: "P_ITEMS",
    ITEMS: "MANAGE_ITEMS",
    PROCEDURES: "MANAGE_PROCEDURES",
    STEPS: "MANAGE_STEPS",
    ITEM_CATEGORIES: "MANAGE_ITEM_CATEGORIES",
    P_EMPLOYEES: "P_EMPLOYEES",
    EMPLOYEES: "MANAGE_EMPLOYEES",
    GROUPS: "MANAGE_GROUPS",
    GROUPS_LOG: "MANAGE_GROUPS_LOG",
    MATERIALS_LOG: "MANAGE_MATERIALS_LOG",
    ITEMS_LOG: "MANAGE_ITEMS_LOG",
    MANAGERS_TASKS: "MANAGE_MANAGERS_TASKS",
    MANAGERS_REPORTS: "MANAGE_MANAGERS_REPORTS",
    P_REPORT: "P_REPORT",
    ORDER_REPORTS: "MANAGE_ORDER_REPORTS",
    TASKS_REPORTS: "MANAGE_TASKS_REPORTS",
    LEADER_REPORTS: "MANAGE_LEADER_REPORTS",
    ADMIN_REPORTS: "MANAGE_ADMIN_REPORTS",
    //
    WORKERS: "MANAGE_WORKERS",
    WORKERS_TASKS: "MANAGE_WORKERS_TASKS",
    WORKERS_REPORTS: "MANAGE_WORKERS_REPORTS",
    LEADER_REPORTS: "MANAGE_LEADER_REPORTS",
    //
    TASKS: "MANAGE_TASKS",
  };
  const iconSize = 20;
  const items = [
    canViewDashboard && {
      key: itemKeys.DASHBOARD,
      icon: <DataFile size={iconSize - 4} />,
      label: <Link to={routes.dashboard.home}>Tổng quan</Link>,
    },
    canVieAdminReports && {
      key: itemKeys.ADMIN_REPORTS,
      icon: <UserOutlined size={iconSize - 2} />,
      label: <Link to={routes.dashboard.adminReports}>Quản lý tiến độ</Link>,
    },
    (canViewEmployees || canViewGroups || canViewAccounts) && {
      key: itemKeys.P_EMPLOYEES,
      icon: <DataUser size={iconSize - 2} />,
      label: "Quản lý nhân sự",
      children: [
        canViewAccounts && {
          key: itemKeys.ACCOUNTS,
          icon: <UserOutlined size={iconSize - 2} />,
          label: <Link to={routes.dashboard.accounts}>Tài khoản</Link>,
        },
        canViewEmployees && {
          key: itemKeys.EMPLOYEES,
          icon: <UserOutlined size={iconSize - 4} />,
          label: <Link to={routes.dashboard.employees}>Nhân viên</Link>,
        },
        canViewGroups && {
          key: itemKeys.GROUPS,
          icon: <EveryUser size={iconSize - 4} />,
          label: <Link to={routes.dashboard.groups}>Tổ</Link>,
        },
      ],
    },
    canViewOrders && {
      key: itemKeys.ORDERS,
      icon: <FormOutlined size={iconSize - 2} />,
      label: <Link to={routes.dashboard.orders}>Đơn đặt hàng</Link>,
    },
    canViewWorkersTasks && {
      key: itemKeys.WORKERS_TASKS,
      icon: <ListView size={iconSize - 4} />,
      label: <Link to={routes.dashboard.workersTasks}>Quản lý công việc</Link>,
    },
    canViewLeadersTasks && {
      key: itemKeys.MANAGERS_TASKS,
      icon: <ListView size={iconSize - 4} />,
      label: <Link to={routes.dashboard.managersTasks}>Đơn hàng</Link>,
    },
    canViewQuotes && {
      key: itemKeys.QUOTES,
      icon: <FileDoneOutlined size={iconSize - 2} />,
      label: <Link to={routes.dashboard.quotes}>Duyệt báo giá</Link>,
    },
    (canViewMaterialTypes || canViewMaterials) && {
      key: itemKeys.P_MATERIALS,
      icon: <BuildOutlined size={iconSize - 2} />,
      label: "Nguyên vật liệu",
      children: [
        canViewMaterialTypes && {
          key: itemKeys.MATERIAL_TYPES,
          icon: <CategoryManagement size={iconSize - 4} />,
          label: <Link to={routes.dashboard.materialTypes}>Loại vật liệu</Link>,
        },
        canViewMaterials && {
          key: itemKeys.MATERIALS,
          icon: <FileDoneOutlined size={iconSize - 4} />,
          label: <Link to={routes.dashboard.materials}>Nguyên vật liệu</Link>,
        },
      ],
    },
    (canViewItemCategories || canViewItems || canViewProcedures || canViewSteps) && {
      key: itemKeys.P_ITEMS,
      icon: <CodeSandboxOutlined size={iconSize - 2} />,
      label: "Sản phẩm",
      children: [
        canViewSteps && {
          key: itemKeys.STEPS,
          icon: <ListOne size={iconSize - 4} />,
          label: <Link to={routes.dashboard.steps}>Danh sách bước</Link>,
        },
        canViewProcedures && {
          key: itemKeys.PROCEDURES,
          icon: <ProcessLine size={iconSize - 4} />,
          label: <Link to={routes.dashboard.procedures}>Danh sách quy trình</Link>,
        },
        canViewItemCategories && {
          key: itemKeys.ITEM_CATEGORIES,
          icon: <CategoryManagement size={iconSize - 4} />,
          label: <Link to={routes.dashboard.itemCategories}>Loại sản phẩm</Link>,
        },
        canViewItems && {
          key: itemKeys.ITEMS,
          icon: <AdjacentItem size={iconSize - 4} />,
          label: <Link to={routes.dashboard.items}>Sản phẩm</Link>,
        },
      ],
    },

    canViewOrderReports && {
      key: itemKeys.P_REPORT,
      icon: <TableReport size={iconSize - 4} />,
      label: "Báo cáo",
      children: [
        canViewOrderReports && {
          key: itemKeys.TASKS_REPORTS,
          icon: <DocSuccess size={iconSize - 4} />,
          label: <Link to={routes.dashboard.taskReports}>Tiến độ</Link>,
        },
        canViewOrderReports && {
          key: `${itemKeys.ORDER_REPORTS}_CHILD`,
          icon: <HourglassNull size={iconSize - 4} />,
          label: <Link to={routes.dashboard.orderReports}>Đơn hàng</Link>,
        },
      ],
    },
    canViewWorkers && {
      key: itemKeys.WORKERS,
      icon: <UserOutlined size={iconSize - 4} />,
      label: <Link to={routes.dashboard.workers}>Công nhân</Link>,
    },
    canViewLeaderReports && {
      key: itemKeys.LEADER_REPORTS,
      icon: <ListView size={iconSize - 4} />,
      label: <Link to={routes.dashboard.leaderReports}>Báo cáo</Link>,
    },
    canViewTasks && {
      key: itemKeys.TASKS,
      icon: <ListView size={iconSize - 4} />,
      label: <Link to={routes.dashboard.tasks}>Công việc</Link>,
    },
  ];

  const getSelectedKey = () => {
    const paths = location.pathname.split("/").filter((e) => e);
    const dashboard = routes.dashboard.root.slice(1);
    if (paths[0] !== dashboard) {
      return undefined;
    }

    switch (paths[1]) {
      case routes.dashboard.home:
        return itemKeys.DASHBOARD;
      case routes.dashboard.accounts:
        return itemKeys.ACCOUNTS;
      case routes.dashboard.orders:
        return itemKeys.ORDERS;
      case routes.dashboard.quotes:
        return itemKeys.QUOTES;
      case routes.dashboard.materials:
        return itemKeys.MATERIALS;
      case routes.dashboard.materialTypes:
        return itemKeys.MATERIAL_TYPES;
      case routes.dashboard.items:
        return itemKeys.ITEMS;
      case routes.dashboard.itemCategories:
        return itemKeys.ITEM_CATEGORIES;
      case routes.dashboard.steps:
        return itemKeys.STEPS;
      case routes.dashboard.procedures:
        return itemKeys.PROCEDURES;
      case routes.dashboard.workersTasks:
        return itemKeys.WORKERS_TASKS;
      case routes.dashboard.managersTasks:
        return itemKeys.MANAGERS_TASKS;
      case routes.dashboard.workersReports:
        return itemKeys.WORKERS_REPORTS;
      case routes.dashboard.managersReports:
        return itemKeys.MANAGERS_REPORTS;
      case routes.dashboard.groups:
        return itemKeys.GROUPS;
      case routes.dashboard.squads:
        return itemKeys.SQUADS;
      case routes.dashboard.workers:
        return itemKeys.WORKERS;
      case routes.dashboard.orderReports:
        return `${itemKeys.ORDER_REPORTS}_CHILD`;
      case routes.dashboard.employees:
        return itemKeys.EMPLOYEES;
      case routes.dashboard.taskReports:
        return itemKeys.TASKS_REPORTS;
      case routes.dashboard.leaderReports:
        return itemKeys.LEADER_REPORTS;
      case routes.dashboard.groupsLog:
        return itemKeys.GROUPS;
      case routes.dashboard.materialsLog:
        return itemKeys.MATERIALS;
      case routes.dashboard.itemsLog:
        return itemKeys.ITEMS;
      case routes.dashboard.adminReports:
        return itemKeys.ADMIN_REPORTS;
    }

    return undefined;
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      theme="light"
      className="dashboard-sider pb-8 overflow-auto !border-x-2 !border-gray-600"
    >
      <Link
        to={routes.dashboard.home}
        className={`flex-center mb-4 duration-500 ${collapsed ? "h-[60px]" : "h-[120px]"}`}
      >
        <img src={logoUrl} height={collapsed ? 40 : 100} className="duration-300" />
      </Link>
      <Menu
        theme="light"
        mode="inline"
        style={{ border: "none" }}
        defaultSelectedKeys={[itemKeys.DASHBOARD]}
        selectedKeys={[getSelectedKey()]}
        items={items}
      />
    </Sider>
  );
};
