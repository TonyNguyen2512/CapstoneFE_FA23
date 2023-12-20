import { Down, Logout, User } from "@icon-park/react";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Image, Space } from "antd";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../providers/user";
import routes from "../../../constants/routes";
import styled from "styled-components";

const Container = styled.div`
  color: white;
`;

export const ProfileBar = () => {
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);
  // console.log(user);

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
        {/* <Avatar size="default" icon={<UserOutlined />} /> */}
        <Image width={30} height={30} src={user?.image} />
      </Space>
      <Dropdown
        menu={{
          items,
        }}
      >
        <span className="cursor-pointer text-[#666] font-semibold" style={{ marginRight: "0px" }}>
          {user?.fullName}
          <Down className="ml-1  top-[0.2rem] bottom-0" />
        </span>
      </Dropdown>
    </Container>
  );
};
