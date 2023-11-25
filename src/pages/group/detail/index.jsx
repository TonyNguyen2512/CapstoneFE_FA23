import { Button, Dropdown, Space, Spin, message } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BasePageContent } from "../../../layouts/containers/BasePageContent";
import { UserContext } from "../../../providers/user";
import GroupApi from "../../../apis/group";
import { Edit, Forbid, More, PreviewOpen, Unlock } from "@icon-park/react";
import { BaseTable } from "../../../components/BaseTable";
import confirm from "antd/lib/modal/confirm";
import { AddWorkerToGroupModal } from "./components/AddWorkerToGroupModal";
import routes from "../../../constants/routes";
import { GroupContext } from "../../../providers/group";

const GroupDetailPage = () => {
  const [loading, setLoading] = useState(false);

  const [addWorkerToGroupModal, setAddWorkerToGroupModal] = useState(false);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [workerNotInGroupList, setWorkerNotInGroupList] = useState([]);

  const [workerList, setGroupWorkerList] = useState([]);
  const [groupCreating, setGroupCreating] = useState(false);

  const { user } = useContext(UserContext);
  const groupRef = useRef();
  const navigate = useNavigate();
  const { id } = useParams();

  const getData = async (id, keyword) => {
    setLoading(true);
    const response = await GroupApi.getWorkersByGroupId(id, keyword);
    setGroupWorkerList(response.data);
    setLoading(false);
  };

  const handleCreateGroup = async (request) => {
    setGroupCreating(true);
    const { groupId, listWorker } = request;
    const data = {
      listUserId: listWorker.filter((item) => item !== user?.id),
      groupId: groupId,
    };
    const response = await GroupApi.addWorkersToGroup(data);
    if (response) {
      message.success("Đăng ký nhóm thành công");
      getData(id);
    } else {
      message.error("Đăng ký nhóm thất bại");
      // message.error(response.message);
    }
    handleWorkerNotInGroup();
    setGroupCreating(false);
    setAddWorkerToGroupModal(false);
  };

  const handleSearch = (value) => {
    getData(id, value);
  };

  const handleWorkerNotInGroup = async () => {
    setLoading(true);
    const response = await GroupApi.getAllWorkerNoYetGroup();
    setWorkerNotInGroupList(response.data);
    setLoading(false);
  };

  const removeWorkerInGroup = async (userId, groupId) => {
    setLoading(true);
    const data = {
      userId: userId,
      groupId: groupId,
    };
    const success = await GroupApi.removeWorkerFromGroup(data);
    if (success) {
      message.success("Loại thành công");
    } else {
      message.error("Loại thất bại");
    }
    getData(id);
    handleWorkerNotInGroup();
    setLoading(false);
  };

  const handleCloseCreateTeamRequestModal = () => {
    setAddWorkerToGroupModal(false);
    setGroupCreating(false);
  };

  useEffect(() => {
    if (id) {
      getData(id);
    }
    handleWorkerNotInGroup();
  }, [id]);

  const getActionItems = (record) => {
    const { isDeleted } = record;
    return [
      {
        key: "VIEW_DETAIL",
        label: "Xem thông tin chi tiết",
        icon: <PreviewOpen />,
        onClick: () => {
          groupRef.current = record;
          navigate(record?.id);
        },
      },
      {
        key: "UPDATE_GROUP",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          groupRef.current = record;
          setAddWorkerToGroupModal(true);
        },
      },
      {
        key: "SET_STATUS",
        danger: !isDeleted,
        label: !isDeleted ? "Xoá" : "Phục hồi",
        icon: !isDeleted ? <Forbid /> : <Unlock />,
        onClick: () => {
          confirm({
            title: "Loại công nhân",
            content: `Chắc chắn loại công nhân "${record.fullName}"?`,
            type: "confirm",
            cancelText: "Hủy",
            onOk: () => {
              groupRef.current = record;
              removeWorkerInGroup(record.id, record.groupId);
            },
            onCancel: () => {},
            closable: true,
          });
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
        return <span>{index + 1}</span>;
      },
    },
    {
      title: "Tên công nhân",
      dataIndex: "fullName",
      key: "fullName",
      render: (_, record) => {
        return (
          <span
            onClick={() => {
              //   showModal(record)
            }}
          >
            {record.fullName}
          </span>
        );
      },
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (_, record) => {
        return (
          <span
            onClick={() => {
              /*showModal(record) */
            }}
          >
            {record.address}
          </span>
        );
      },
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
    {
      title: "Số điện thoại",
      dataIndex: "userName",
      key: "userName",
      render: (_, record) => {
        return (
          <span
            onClick={() => {
              /*showModal(record) */
            }}
          >
            {record.userName}
          </span>
        );
      },
      sorter: (a, b) => a.userName - b.userName,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (_, record) => {
        return (
          <span
            onClick={() => {
              /*showModal(record) */
            }}
          >
            {record.email}
          </span>
        );
      },
      sorter: (a, b) => a.email - b.email,
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      width: "10%",
      align: "center",
      render: (_, record) => {
        return (
          <Dropdown menu={{ items: getActionItems(record) }}>
            <Button className="mx-auto flex-center" icon={<More />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <BasePageContent onBack={() => navigate(`${routes.dashboard.root}/${routes.dashboard.groups}`)}>
      <Space className="w-full flex justify-between mb-6">
        <div></div>
        <Button
          type="primary"
          className="btn-primary app-bg-primary font-semibold text-white"
          onClick={() => setAddWorkerToGroupModal(true)}
        >
          Thêm công nhân
        </Button>
      </Space>
      <BaseTable
        title="Danh sách công nhân"
        open={addWorkerToGroupModal}
        dataSource={workerList}
        columns={columns}
        loading={loading}
        pagination={true}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm nhóm...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      <AddWorkerToGroupModal
        open={addWorkerToGroupModal}
        onSubmit={handleCreateGroup}
        confirmLoading={groupCreating}
        onCancel={handleCloseCreateTeamRequestModal}
        group={id}
        workers={workerNotInGroupList}
      />
    </BasePageContent>
  );
};

export default GroupDetailPage;
