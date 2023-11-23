import { Down, Logout, User } from "@icon-park/react";
import { BellFilled, BellOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Space } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../providers/user";
import routes from "../../../constants/routes";
import styled from "styled-components";
import useMicrosoftSignalR from "../../../hooks/microsoftSignalr";

const Container = styled.div`
  color: white;
`;

export const ProfileBar = () => {
  const navigate = useNavigate();
  const { createMicrosoftSignalrConnection, ENotificationHub } = useMicrosoftSignalR();

  const { user, setUser } = useContext(UserContext);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    initNotificationSignalR();
  }, []);

  const initNotificationSignalR = () => {
    // connect to hub
    const connection = createMicrosoftSignalrConnection(ENotificationHub.EndPoint);

    const method = ENotificationHub.Method;

    // listen to method name
    connection?.on(method.NewNotify, (res) => {
      console.log("Received a message from the server:", res);
      setNotificationCount(res?.countUnseen || 0);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
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
        {notificationCount > 0 ? (
          <Badge count={notificationCount}>
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
        <span className="cursor-pointer text-[#666] font-semibold" style={{ marginRight: "0px" }}>
          {user?.fullName}
          <Down className="ml-1 absolute top-[0.2rem] bottom-0" />
        </span>
      </Dropdown>
    </Container>
  );
};
