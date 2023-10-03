import { Down, Logout, User } from "@icon-park/react";
import { BellFilled, BellOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Space } from "antd";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../providers/user";
import routes from "../../../constants/routes";
import { roles } from "../../../constants/app";
import styled from "styled-components";

const Container = styled.div`
  color: white;
`;

export const ProfileBar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [notificationsCount, setCount] = useState(0);

  const handleLogout = () => {
    // localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(undefined);
    navigate(routes.login);
  };

  const items = [
    {
      key: "PROFILE",
      label: <Link to={routes.dashboard.profile}>Hồ sơ</Link>,
      icon: <User />,
    },
    {
      key: "LOGOUT",
      label: <span>Đăng xuất</span>,
      icon: <Logout />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Container theme="light">
      <Space size={24} style={{ margin: "0 0.5rem" }}>
        {notificationsCount > 0 ? (
          <Badge count={notificationsCount}>
            <BellFilled className="text-[#666] text-2xl relative top-1" />
          </Badge>
        ) : (
          <BellOutlined className="text-[#666] text-2xl relative top-1" />
        )}

        <Avatar size="default" icon={<UserOutlined />} />
      </Space>
      <Dropdown
        menu={{
          items,
        }}
      >
        <span className="cursor-pointer text-[#666] font-semibold">
          {user?.fullName}
          {/* - {getRoleName()} */}
          <Down />
        </span>
      </Dropdown>
    </Container>
  );
};
