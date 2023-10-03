import React from "react";
import { Table, Button, Tag } from "antd";
import { mockAccounts } from "../../../../__mocks__/accounts";
import { roles } from "../../../../constants/app";
import { Edit } from "@icon-park/react";
import { getRoleName } from "../../../utils";

const ProjectList = ({ onEditAccount }) => {
  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (_, { role }) => {
        return (
          <Tag color={role === roles.ADMIN ? "blue" : role === roles.WORKER ? "cyan" : "purple"}>
            {getRoleName(role)}
          </Tag>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, { active }) => {
        return (
          <Tag color={active ? "blue-inverse" : "red-inverse"}>
            {active ? "Đang hoạt động" : "Khóa"}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return <Button onClick={onEditAccount} className="flex-center" icon={<Edit />} />;
      },
    },
  ];

  return <Table dataSource={mockAccounts} columns={columns} />;
};

export default ProjectList;
