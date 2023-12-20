import { Edit, Forbid, More, Phone, Unlock, UserPositioning } from "@icon-park/react";
import { Button, Dropdown, Space, Table, Tag, Tooltip, Typography, message } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import RoleApi from "../../../../apis/role";
import UserApi from "../../../../apis/user";
import { BaseTable } from "../../../../components/BaseTable";
import { roles } from "../../../../constants/app";
import { getRoleName } from "../../../../utils";
import { PageSize } from "../../../../constants/enum";
import GroupApi from "../../../../apis/group";
import { UserContext } from "../../../../providers/user";
import { WorkerListModal } from "../../components/WorkerListModal";
import { useNavigate } from "react-router-dom";

const roleColors = {
  ADMIN: "#FF7777",
  FOREMAN: "#4ECA69",
  LEADER: "#F1CA5A",
  WORKER: "#59A7DE",
};

const WorkerList = () => {
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [roleCreateOptions, setRoleCreateOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const userRef = useRef();
  const { user } = useContext(UserContext);
  const { Text } = Typography;
  const navigate = useNavigate();

  const getUsers = async (search, pageIndex, handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }
    const data = await GroupApi.getWorkersByGroupId(
      user?.group?.id,
      search,
      pageIndex,
      PageSize.WORKERS_LIST
    );
    console.log(data);
    setEmployees(data);
    setLoading(false);
  };

  const getLeaderAndWorker = async () => {
    const data = await UserApi.getRoleLeaderAndWorker();
    setRoleOptions(data.data);
  };

  useEffect(() => {
    getUsers();
    getLeaderAndWorker();
  }, []);

  const getActionItems = (record) => {
    const { banStatus, id, role } = record;

    return [
      {
        key: "UPDATE_USER",
        label: "Xem thông tin chi tiết",
        icon: <Edit />,
        // disabled: role === roles.ADMIN,
        onClick: () => {
          userRef.current = record;
          navigate(record?.id);
        },
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
        return <span>{index + 1 + (currentPage - 1) * PageSize.WORKERS_LIST}</span>;
      },
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (_, record) => {
        return (
          <Tooltip title={() => <img loading="eager" src={record.image} className="w-full" />}>
            {record.fullName}
          </Tooltip>
        );
      },
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
    },
    {
      title: "Trạng thái",
      dataIndex: "banStatus",
      key: "banStatus",
      render: (_, { banStatus }) => {
        return (
          <span style={{ color: !banStatus ? "#29CB00" : "#FF0000", fontWeight: "bold" }}>
            {!banStatus ? "Đang hoạt động" : "Không hoạt động"}
          </span>
        );
      },
      sorter: (a, b) => a.banStatus - b.banStatus,
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
    getUsers(value, 1, true);
  };

  const onPageChange = (current) => {
    setCurrentPage(current);
    getUsers(null, current, false);
  };

  useEffect(() => {
    getUsers(null, 1, true);
  }, []);

  return (
    <>
      <BaseTable
        title={"Tổ " + user?.group.name}
        loading={loading}
        dataSource={employees?.data}
        columns={columns}
        pagination={{
          onChange: onPageChange,
          pageSize: PageSize.WORKERS_LIST,
          total: employees?.total,
        }}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm tài khoản...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
    </>
  );
};

export default WorkerList;
