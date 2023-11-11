import { Edit, Forbid, More, Unlock } from "@icon-park/react";
import { Button, Dropdown, Space, Tag, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import RoleApi from "../../../../apis/role";
import UserApi from "../../../../apis/user";
import { BaseTable } from "../../../../components/BaseTable";
import { roles } from "../../../../constants/app";
import { getRoleName } from "../../../../utils";
import { UpdateRoleModal } from "../../components/UpdateRoleModal";
import { AccountModal } from "../../components/AccountModal";

const roleColors = {
  ADMIN: "#FF7777",
  FACTORY: "#4ECA69",
  FOREMAN: "#4ECA69",
  MANAGER: "#F1CA7F",
  WORKER: "#59A7DE",
};

const AccountList = () => {
  const [showUpdateRoleModal, setShowUpdateRoleModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  const userRef = useRef();

  const getUsers = async (keyword) => {
    setLoading(true);
    const data = await UserApi.getAll(keyword);
    console.log(data);
    data?.sort((a, b) => {
      if (a.role?.name === roles.ADMIN) {
        return -1; // a comes before b
      }
      if (b.role?.name === roles.ADMIN) {
        return 1; // b comes before a
      }
      return 0; // no change in order
    });
    setUsers(data);
    setLoading(false);
  };

  const getAllRoles = async () => {
    const data = await RoleApi.getAllRoles();
    setRoleOptions(data);
  };

  const banUser = async (userId) => {
    const success = await UserApi.banUser(userId);
    if (success) {
      message.success("Đã khóa tài khoản");
      getUsers();
    } else {
      message.error("Khóa tài khoản thất bại");
    }
  };

  const unbanUser = async (userId) => {
    const success = await UserApi.unbanUser(userId);
    if (success) {
      message.success("Đã mở khóa tài khoản");
      getUsers();
    } else {
      message.error("Mở khóa tài khoản thất bại");
    }
  };

  useEffect(() => {
    getUsers();
    getAllRoles();
  }, []);

  const getActionItems = (record) => {
    const { isBan, id, role } = record;

    return [
      {
        key: "UPDATE_ROLE",
        label: "Cập nhật vai trò",
        icon: <Edit />,
        disabled: role === roles.ADMIN,
        onClick: () => {
          userRef.current = record;
          setShowUpdateRoleModal(true);
        },
      },
      {
        key: "SET_STATUS",
        label: isBan ? "Mở khóa tài khoản" : "Khóa tài khoản",
        danger: !isBan,
        icon: !isBan ? <Forbid /> : <Unlock />,
        onClick: () => {
          if (isBan) {
            unbanUser(id);
          } else {
            banUser(id);
          }
        },
        disabled: role === roles.ADMIN,
      },
    ];
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: "Số điện thoại",
      dataIndex: "userName",
      key: "userName",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Vai trò",
      dataIndex: "roleId",
      key: "roleId",
      render: (_, { roleId }) => {
        const role = roleOptions.find((r) => r.id === roleId);
        return (
          <Tag
            className="text-center"
            color={roleColors[role?.name?.toUpperCase() || "WORKER"]}
            style={{ fontWeight: "bold" }}
          >
            {getRoleName(role?.name)}
          </Tag>
        );
      },
      sorter: (a, b) => a.role.localeCompare(b.role),
      filter: {
        placeholder: "Chọn vai trò",
        label: "Vai trò",
        filterOptions: roleOptions?.map((role) => {
          return {
            label: getRoleName(role?.name),
            value: role?.id,
          };
        }),
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "isBan",
      key: "isBan",
      render: (_, { isBan }) => {
        return (
          // <Tag color={!isBan ? "#29CB00" : "#FF0000"}>
          //   {!isBan ? "Đang hoạt động" : "Không hoạt động"}
          // </Tag>
          <span style={{ color: !isBan ? "#29CB00" : "#FF0000", fontWeight: "bold" }}>
            {!isBan ? "Đang hoạt động" : "Không hoạt động"}
          </span>
        );
      },
      sorter: (a, b) => a.isBan - b.isBan,
      filter: {
        placeholder: "Chọn trạng thái",
        label: "Trạng thái",
        filterOptions: [
          {
            label: "Đang hoạt động",
            value: false,
          },
          {
            label: "Không hoạt động",
            value: true,
          },
        ],
      },
    },
    {},
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <>
            {record.role !== roles.ADMIN && (
              <Dropdown menu={{ items: getActionItems(record) }}>
                <Button className="mx-auto flex-center" icon={<More />} />
              </Dropdown>
            )}
          </>
        );
      },
    },
  ];

  const handleSearch = (value) => {
    getUsers(value);
  };

  return (
    <>
      <Space className="w-full flex justify-between mb-6">
        <div></div>
        <Button
          className="btn-primary app-bg-primary font-semibold text-white"
          type="primary"
          onClick={() => setShowUserModal(true)}
        >
          Tạo tài khoản
        </Button>
      </Space>
      <BaseTable
        title="Quản lý tài khoản"
        loading={loading}
        dataSource={users}
        columns={columns}
        pagination={{ pageSize: 6 }}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm tài khoản...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      <AccountModal
        data={userRef.current}
        users={users || []}
        roleOptions={roleOptions?.map((e) => {
          return {
            key: e.name,
            value: e.id,
            label: getRoleName(e.name),
          };
        })}
        open={showUserModal}
        onCancel={() => {
          setShowUserModal(false);
          userRef.current = null;
        }}
        onSuccess={() => getUsers()}
      ></AccountModal>
      <UpdateRoleModal
        roleOptions={roleOptions?.map((e) => {
          return {
            key: e.name,
            value: e.id,
            label: getRoleName(e.name),
          };
        })}
        user={userRef.current}
        open={showUpdateRoleModal}
        onCancel={() => setShowUpdateRoleModal(false)}
        onSuccess={() => getUsers()}
      />
    </>
  );
};

export default AccountList;
