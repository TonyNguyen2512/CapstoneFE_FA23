import { Button, Dropdown, Space, Spin, message } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TeamApi from "../../../apis/group";
import { BasePageContent } from "../../../layouts/containers/BasePageContent";
import { UserContext } from "../../../providers/user";
import GroupApi from "../../../apis/group";
import { Edit, Forbid, More, PreviewOpen, Unlock } from "@icon-park/react";
import { BaseTable } from "../../../components/BaseTable";
import { GroupModal } from "../components/GroupModal";
import confirm from "antd/lib/modal/confirm";
import { AddWorkerToGroupModal } from "./components/AddWorkerToGroupModal";

const GroupDetailPage = () => {
  const [loading, setLoading] = useState(false);
  const [addWorkerToGroupModal, setAddWorkerToGroupModalModal] = useState(false);
  const [workerList, setGroupWorkerList] = useState([]);
  const groupRef = useRef();
  const navigate = useNavigate();
  const { id } = useParams();

  const getData = async (id) => {
    setLoading(true);
    const response = await GroupApi.getWorkersByGroupId(id);

    setGroupWorkerList(response.data);
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      getData(id, true);
    }
  }, [id]);

  const getActionItems = (record) => {
    const { isDeleted, id } = record;
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
          setAddWorkerToGroupModalModal(true);
        },
      },
      {
        key: "SET_STATUS",
        danger: !isDeleted,
        label: !isDeleted ? "Xoá" : "Phục hồi",
        icon: !isDeleted ? <Forbid /> : <Unlock />,
        onClick: () => {
          confirm({
            title: "Xoá nhóm",
            content: `Chắc chắn xoá "${record.name}"?`,
            type: "confirm",

            cancelText: "Hủy",
            onOk: () => deleteGroup(record.id),
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

  const handleSearch = (value) => {
    getData(value);
  };

  const deleteGroup = async (value) => {
    setLoading(true);
    const success = await GroupApi.deleteGroup(value);
    if (success) {
      message.success("Xoá thành công");
    } else {
      message.error("Xoá thất bại");
    }
    getData();
    setLoading(false);
  };

  return (
    <>
      <Space className="w-full flex justify-between mb-6">
        <div></div>
        <Button
          type="primary"
          className="btn-primary app-bg-primary font-semibold text-white"
          onClick={() => setAddWorkerToGroupModalModal(true)}
        >
          Thêm công nhân
        </Button>
      </Space>
      <BaseTable
        title="Danh sách công nhân"
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
        data={groupRef.current}
        open={addWorkerToGroupModal}
        onCancel={() => {
          setAddWorkerToGroupModalModal(false);
          groupRef.current = null;
        }}
        onSuccess={() => getData()}
      />
    </>
  );
};

export default GroupDetailPage;
