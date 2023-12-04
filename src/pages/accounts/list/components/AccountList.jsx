import { Edit, Forbid, More, Phone, Unlock, UserPositioning } from "@icon-park/react";
import { Button, Dropdown, Space, Tag, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import RoleApi from "../../../../apis/role";
import UserApi from "../../../../apis/user";
import { BaseTable } from "../../../../components/BaseTable";
import { roles } from "../../../../constants/app";
import { getRoleName } from "../../../../utils";
import { UpdateRoleModal } from "../../components/UpdateRoleModal";
import { AccountModal } from "../../components/AccountModal";
import { UpdatePhoneModal } from "../../components/UpdatePhoneModal";
import { PageSize } from "../../../../constants/enum";

const roleColors = {
  ADMIN: "#FF7777",
  FACTORY: "#4ECA69",
  FOREMAN: "#4ECA69",
  MANAGER: "#F1CA7F",
  LEADER: "#F1CA5A",
  WORKER: "#59A7DE",
};

const AccountList = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [roleCreateOptions, setRoleCreateOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const userRef = useRef();

  const getUsers = async (search, pageIndex, handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }
    const data = await UserApi.GetAllWithSearchAndPaging(search, pageIndex, PageSize.ACCOUNTS_LIST);
    console.log(data);
    // data?.sort((a, b) => {
    //   if (a.role?.name === roles.ADMIN) {
    //     return -1; // a comes before b
    //   }
    //   if (b.role?.name === roles.ADMIN) {
    //     return 1; // b comes before a
    //   }
    //   return 0; // no change in order
    // });
    setUsers(data);
    setLoading(false);
  };

  const getRoleForCreateUsers = async () => {
    const data = await RoleApi.getRoleForCreateUser();
    setRoleCreateOptions(data);
    getUsers();
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
    getUsers(null, 1, true);
    getAllRoles();
    getRoleForCreateUsers();
  }, []);

  const getActionItems = (record) => {
    const { banStatus, id, role } = record;

    return [
      {
        key: "UPDATE_USER",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        // disabled: role === roles.ADMIN,
        onClick: () => {
          userRef.current = record;
          setShowUserModal(true);
        },
      },
      {
        key: "UPDATE_PHONE",
        label: "Cập nhật số điện thoại",
        icon: <Phone />,
        onClick: () => {
          userRef.current = record;
          setShowPhoneModal(true);
        },
      },
      {
        key: "UPDATE_ROLE",
        label: "Cập nhật vai trò",
        icon: <UserPositioning />,
        // disabled: role === roles.ADMIN,
        onClick: () => {
          userRef.current = record;
          setShowModal(true);
        },
      },
      {
        key: "SET_STATUS",
        label: banStatus ? "Mở khóa tài khoản" : "Khóa tài khoản",
        danger: !banStatus,
        icon: !banStatus ? <Forbid /> : <Unlock />,
        onClick: () => {
          if (banStatus) {
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
      title: "#",
      dataIndex: "index",
      key: "index",
      width: "5%",
      // align: "center",
      render: (_, record, index) => {
        return <span>{(index + 1) + (((currentPage) - 1) * ( PageSize.ACCOUNTS_LIST))}</span>;
      },
    },
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
      sorter: (a, b) => a.role?.name.localeCompare(b.role?.name),
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
      dataIndex: "banStatus",
      key: "banStatus",
      render: (_, { banStatus }) => {
        return (
          // <Tag color={!isBan ? "#29CB00" : "#FF0000"}>
          //   {!isBan ? "Đang hoạt động" : "Không hoạt động"}
          // </Tag>
          <span style={{ color: !banStatus ? "#29CB00" : "#FF0000", fontWeight: "bold" }}>
            {!banStatus ? "Đang hoạt động" : "Không hoạt động"}
          </span>
        );
      },
      sorter: (a, b) => a.banStatus - b.banStatus,
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
    getUsers(value, 1, true);
  };

  const onPageChange = (current) => {
    setCurrentPage(current);
    getUsers(null, current, false);
  };

  return (
    <>
      <Space className="w-full flex justify-between mb-6">
        <div></div>
        <Button
          type="primary"
          className="btn-primary app-bg-primary font-semibold text-white"
          onClick={() => setShowUserModal(true)}
        >
          Tạo tài khoản
        </Button>
      </Space>
      <BaseTable
        title="Quản lý tài khoản"
        loading={loading}
        dataSource={users.data}
        columns={columns}
        pagination={{
          onChange: onPageChange,
          pageSize: PageSize.ACCOUNTS_LIST,
          total: users?.total,
        }}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm tài khoản...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      <AccountModal
        data={userRef.current}
        roleOptions={roleCreateOptions?.map((e) => {
          return {
            key: e.name,
            value: e.id,
            label: getRoleName(e.name),
          };
        })}
        open={showUserModal}
        onSuccess={() => getUsers()}
        onCancel={() => {
          setShowUserModal(false);
          userRef.current = null;
        }}
      />
      <UpdateRoleModal
        roleOptions={roleOptions?.map((e) => {
          return {
            key: e.name,
            value: e.id,
            label: getRoleName(e.name),
          };
        })}
        user={userRef.current}
        open={showModal}
        onSuccess={() => getUsers()}
        onCancel={() => {
          setShowModal(false);
          userRef.current = null;
        }}
      />
      <UpdatePhoneModal
        data={userRef.current}
        open={showPhoneModal}
        onSuccess={() => getUsers()}
        onCancel={() => {
          setShowPhoneModal(false);
          userRef.current = null;
        }}
      />
    </>
  );
};

export default AccountList;
