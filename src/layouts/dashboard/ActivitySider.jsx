import { Menu, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import routes from "../../constants/routes";
import { DashboardOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const ActivitySider = () => {
  const [collapsed, setCollapsed] = useState(false);

  const iconSize = 20;
  const items = [
    {
      key: `noti-${0}`,
      icon: <DashboardOutlined size={iconSize} />,
      label: <Link to={routes.dashboard.home}>Bảng điều khiển</Link>,
    },
    // canViewAccount && {
    //   key: itemKeys.ACCOUNT,
    //   icon: <User size={iconSize} />,
    //   label: <Link to={routes.dashboard.accounts}>Tài khoản</Link>,
    // },
    // canViewCourse && {
    //   key: itemKeys.COURSE,
    //   icon: <DegreeHat size={iconSize} />,
    //   label: <Link to={routes.dashboard.courses}>Môn học</Link>,
    // },
    // canViewSemester && {
    //   key: itemKeys.SEMESTER,
    //   icon: <Hourglass size={iconSize} />,
    //   label: <Link to={routes.dashboard.semester}>Học kỳ</Link>,
    // },
    // canViewClass && {
    //   key: itemKeys.CLASS,
    //   icon: <Classroom size={iconSize} />,
    //   label: <Link to={routes.dashboard.classes}>Lớp học</Link>,
    // },
    // canViewTeam && {
    //   key: itemKeys.TEAM,
    //   icon: <EveryUser size={iconSize} />,
    //   label: <Link to={routes.dashboard.teams}>Nhóm của tôi</Link>,
    // },
    // canViewReport && {
    //   key: itemKeys.REPORT,
    //   icon: <Analysis size={iconSize} />,
    //   label: <Link to={routes.dashboard.report}>Báo cáo nhóm</Link>,
    // },
  ];

  const getSelectedKey = () => {};

  return (
    <Sider
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className="activity-sider px-2 pb-8 h-[100vh]"
    >
      <Title level={4} className="text-[#666]">
        Thông báo
      </Title>
      <Menu
        theme="light"
        mode="inline"
        style={{ border: "none" }}
        defaultSelectedKeys={[""]}
        selectedKeys={[getSelectedKey()]}
        items={items}
      />
    </Sider>
  );
};
