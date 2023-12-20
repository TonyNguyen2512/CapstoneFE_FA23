import { Header } from "antd/es/layout/layout";
import { Input, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { ProfileBar } from "./Profile";
import { Search } from "@icon-park/react";
import { useLocation } from "react-router-dom";
import Notifications from "./Notifications";

const { Title } = Typography;

export const AppHeader = () => {
  const location = useLocation();

  const [title, setTitle] = useState("Quản lý xưởng nội thất JAMA");

  useEffect(() => {
    // setTitle(getTitle(location.pathname));
  }, [location.pathname]);

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #eee",
        backgroundColor: "white",
        paddingLeft: 16,
        paddingRight: 32,
      }}
    >
      <Title level={4} className="mb-0 !text-[#333]">
        {title}
      </Title>
      <Space direction="horizontial" size="middle">
        {/* <Space.Compact>
          <Input
            placeholder="Tìm kiếm hoặc gõ lệnh (Ctrl + G)"
            style={{ width: "280px" }}
            prefix={<Search size="16" fill="#999" style={{ marginTop: "4px" }} />}
          />
        </Space.Compact> */}
        <Notifications />
        <ProfileBar />
      </Space>
    </Header>
  );
};
