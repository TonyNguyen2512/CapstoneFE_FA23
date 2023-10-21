import { Edit, Forbid, More, Unlock } from "@icon-park/react";
import { Button, Dropdown, Tag, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import RoleApi from "../../../../apis/role";
import UserApi from "../../../../apis/user";
import { BaseTable } from "../../../../components/BaseTable";
import { roles } from "../../../../constants/app";
import { getRoleName } from "../../../../utils";
import { UpdateRoleModal } from "../../components/UpdateRoleModal";

const AccountList = () => {
  const [accountLoading, setAccountLoading] = useState(false);
  const [showUpdateRoleModal, setShowUpdateRoleModal] = useState(false);
  const [accounts, setAccounts] = useState([]);

  const userRef = useRef();
  const rolesRef = useRef();

  const getUsers = async (keyword) => {
    setAccountLoading(true);
    const data = await UserApi.searchUsers(keyword);
    data.sort((a, b) => {
      if (a.role.name === roles.ADMIN) {
        return -1; // a comes before b
      }
      if (b.role.name === roles.ADMIN) {
        return 1; // b comes before a
      }
      return 0; // no change in order
    });
    // data.map((d) => {
    //   return {
    //     ...d,
    //     role: d.role?.name || "",
    //   };
    // });
    setAccounts(
      data.map((d) => {
        return {
          ...d,
          role: d.role?.name || "",
        };
      })
    );
    setAccountLoading(false);
  };

  const getAllRoles = async () => {
    const result = await RoleApi.getAllRoles();
    rolesRef.current = result.filter((e) => e.name !== roles.ADMIN);
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
    const { isBan, userId, role } = record;

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
            unbanUser(userId);
          } else {
            banUser(userId);
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
    // {
    //   title: "Ngày sinh",
    //   dataIndex: "birthday",
    //   key: "birthday",
    //   sorter: (a, b) => a.birthday.localeCompare(b.birthday),
    // },
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
      dataIndex: "role",
      key: "role",
      render: (_, { role }) => {
        return (
          <Tag
            className="text-center"
            color={
              role === roles.ADMIN
                ? "#FF7777"
                : role === roles.FACTORY
                ? "#4ECA69"
                : role === roles.LEADER
                ? "#F1CA7F"
                : "#59A7DE"
            }
          >
            {getRoleName(role)}
          </Tag>
        );
      },
      sorter: (a, b) => a.role.localeCompare(b.role),
      filter: {
        placeholder: "Chọn vai trò",
        label: "Vai trò",
        filterOptions: [
          {
            label: getRoleName(roles.ADMIN),
            value: roles.ADMIN,
          },
          {
            label: getRoleName(roles.WORKER),
            value: roles.WORKER,
          },
          {
            label: getRoleName(roles.FACTORY),
            value: roles.FACTORY,
          },
        ],
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
          <span style={{ color: !isBan ? "#29CB00" : "#FF0000" }}>
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
            label: "Khóa",
            value: true,
          },
        ],
      },
    },
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
      <BaseTable
        title="Quản lý tài khoản"
        dataSource={accounts}
        columns={columns}
        loading={accountLoading}
        pagination={false}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm tài khoản...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      <UpdateRoleModal
        user={userRef.current}
        open={showUpdateRoleModal}
        onCancel={() => setShowUpdateRoleModal(false)}
        allRoles={rolesRef.current}
        onSuccess={() => getUsers()}
      />
    </>
  );
};

export default AccountList;
