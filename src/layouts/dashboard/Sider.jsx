import {
  DegreeHat,
  User,
  Classroom,
  Analysis,
  Hourglass,
  EveryUser,
  HourglassNull,
  ListView,
  DataUser,
  CategoryManagement,
  AdjacentItem,
  FileEditing,
} from "@icon-park/react";
import { Menu, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import routes from "../../constants/routes";
import { usePermissions } from "../../hooks/permission";
import { ALL_PERMISSIONS, logoUrl } from "../../constants/app";
import {
  BuildOutlined,
  CodeSandboxOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  FormOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

export const AppSider = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const permissions = usePermissions();

  const canViewAccounts = permissions?.includes(ALL_PERMISSIONS.accounts?.sider);
  const canViewOrders = permissions?.includes(ALL_PERMISSIONS.orders?.sider);
  const canViewQuotes = permissions?.includes(ALL_PERMISSIONS.quotes?.sider);
  const canViewMaterials = permissions?.includes(ALL_PERMISSIONS.materials?.sider);
  const canViewMaterialTypes = permissions?.includes(ALL_PERMISSIONS.materialTypes?.sider);
  const canViewItems = permissions?.includes(ALL_PERMISSIONS.items?.sider);
  const canViewItemTypes = permissions?.includes(ALL_PERMISSIONS.itemTypes?.sider);
  const canViewEmployees = permissions?.includes(ALL_PERMISSIONS.employees?.sider);
  const canViewGroups = permissions?.includes(ALL_PERMISSIONS.groups?.sider);
  const canViewSquads = permissions?.includes(ALL_PERMISSIONS.squads?.sider);
  const canViewManagersTasks = permissions?.includes(ALL_PERMISSIONS.managersTasks?.sider);
  const canViewManagersReports = permissions?.includes(ALL_PERMISSIONS.managersReports?.sider);
  const canViewWorkers = permissions?.includes(ALL_PERMISSIONS.workers?.sider);
  const canViewWorkersTasks = permissions?.includes(ALL_PERMISSIONS.workersTasks?.sider);
  const canViewWorkersReports = permissions?.includes(ALL_PERMISSIONS.workersReports?.sider);
  const canViewTasks = permissions?.includes(ALL_PERMISSIONS.tasks?.sider);
  const canViewReports = permissions?.includes(ALL_PERMISSIONS.reports?.sider);

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
    ITEM_TYPES: "MANAGE_ITEM_TYPES",
    P_EMPLOYEES: "P_EMPLOYEES",
    EMPLOYEES: "MANAGE_EMPLOYEES",
    GROUPS: "MANAGE_GROUPS",
    SQUADS: "MANAGE_SQUADS",
    MANAGERS_TASKS: "MANAGE_MANAGERS_TASKS",
    MANAGERS_REPORTS: "MANAGE_MANAGERS_REPORTS",
    //
    WORKERS: "MANAGE_WORKERS",
    WORKERS_TASKS: "MANAGE_WORKERS_TASKS",
    WORKERS_REPORTS: "MANAGE_WORKERS_REPORTS",
    //
    TASKS: "MANAGE_TASKS",
    REPORTS: "MANAGE_REPORTS",
  };
  const iconSize = 20;
  const items = [
    {
      key: itemKeys.DASHBOARD,
      icon: <DashboardOutlined size={iconSize} />,
      label: <Link to={routes.dashboard.home}>Tổng quan</Link>,
    },
    canViewAccounts && {
      key: itemKeys.ACCOUNTS,
      icon: <UserOutlined size={iconSize} />,
      label: <Link to={routes.dashboard.accounts}>Quản lý tài khoản</Link>,
    },
    canViewOrders && {
      key: itemKeys.ORDERS,
      icon: <FormOutlined size={iconSize} />,
      label: <Link to={routes.dashboard.orders}>Đơn đặt hàng</Link>,
    },
    // canViewQuotes && {
    //   key: itemKeys.QUOTES,
    //   icon: <FileDoneOutlined size={iconSize} />,
    //   label: <Link to={routes.dashboard.quotes}>Duyệt báo giá</Link>,
    // },
    (canViewMaterialTypes || canViewMaterials) && {
      key: itemKeys.P_MATERIALS,
      icon: <BuildOutlined size={iconSize} />,
      label: "Nguyên vật liệu",
      children: [
        canViewMaterialTypes && {
          key: itemKeys.MATERIAL_TYPES,
          icon: <CategoryManagement size={iconSize - 4} />,
          label: <Link to={routes.dashboard.materialTypes}>Loại vật liệu</Link>,
        },
        canViewMaterials && {
          key: itemKeys.MATERIALS,
          icon: <FileDoneOutlined size={iconSize} />,
          label: <Link to={routes.dashboard.materials}>Danh sách vật liệu</Link>,
        },
      ],
    },
    (canViewItemTypes || canViewItems) && {
      key: itemKeys.P_ITEMS,
      icon: <CodeSandboxOutlined size={iconSize} />,
      label: "Sản phẩm",
      children: [
        canViewItemTypes && {
          key: itemKeys.ITEM_TYPES,
          icon: <CategoryManagement size={iconSize - 4} />,
          label: <Link to={routes.dashboard.itemTypes}>Loại sản phẩm</Link>,
        },
        canViewItems && {
          key: itemKeys.ITEMS,
          icon: <AdjacentItem size={iconSize - 4} />,
          label: <Link to={routes.dashboard.items}>Danh sách sản phẩm</Link>,
        },
      ],
    },
    (canViewEmployees || canViewGroups || canViewSquads) && {
      key: itemKeys.P_EMPLOYEES,
      icon: <DataUser size={iconSize - 2} />,
      label: "Quản lý nhân sự",
      children: [
        canViewGroups && {
          key: itemKeys.GROUPS,
          icon: <EveryUser size={iconSize - 4} />,
          label: <Link to={routes.dashboard.root}>Tổ</Link>,
        },
        canViewSquads && {
          key: itemKeys.SQUADS,
          icon: <EveryUser size={iconSize - 4} />,
          label: <Link to={routes.dashboard.root}>Nhóm</Link>,
        },
        canViewEmployees && {
          key: itemKeys.EMPLOYEES,
          icon: <UserOutlined size={iconSize - 4} />,
          label: <Link to={routes.dashboard.root}>Nhân viên</Link>,
        },
        canViewWorkers && {
          key: itemKeys.WORKERS,
          icon: <FileDoneOutlined size={iconSize - 4} />,
          label: <Link to={routes.dashboard.root}>Công nhân</Link>,
        },
      ],
    },
    canViewManagersTasks && {
      key: itemKeys.MANAGERS_TASKS,
      icon: <ListView size={iconSize - 4} />,
      label: <Link to={routes.dashboard.managersTasks}>Quản lý công việc</Link>,
    },
    canViewWorkersTasks && {
      key: itemKeys.WORKERS_TASKS,
      icon: <ListView size={iconSize - 4} />,
      label: <Link to={routes.dashboard.workersTasks}>Quản lý công việc</Link>,
    },
    canViewManagersReports && {
      key: itemKeys.MANAGERS_REPORTS,
      icon: <HourglassNull size={iconSize - 4} />,
      label: <Link to={routes.dashboard.root}>Báo cáo tiến độ</Link>,
    },
    //
   
    // canViewWorkersTasks && {
    //   key: itemKeys.WORKERS_TASKS,
    //   icon: <FileDoneOutlined size={iconSize} />,
    //   label: <Link to={routes.dashboard.root}>Duyệt báo giá</Link>,
    // },
    // canViewWorkersReports && {
    //   key: itemKeys.WORKERS_REPORTS,
    //   icon: <FileDoneOutlined size={iconSize} />,
    //   label: <Link to={routes.dashboard.root}>Duyệt báo giá</Link>,
    // },
    //
    canViewTasks && {
      key: itemKeys.TASKS,
      icon: <ListView size={iconSize - 4} />,
      label: <Link to={routes.dashboard.tasks}>Công việc</Link>,
    },
    canViewReports && {
      key: itemKeys.REPORTS,
      icon: <FileEditing size={iconSize - 4} />,
      label: <Link to={routes.dashboard.reports}>Danh sách đánh giá</Link>,
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
    }

    return undefined;
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      theme="light"
      className="dashboard-sider pb-8 h-[100vh] !border-x-2 !border-gray-600"
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
