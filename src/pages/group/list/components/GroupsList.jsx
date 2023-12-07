import { Edit, Forbid, More, PreviewOpen, Unlock } from "@icon-park/react";
import { Button, Dropdown, Space, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { BaseTable } from "../../../../components/BaseTable";
import confirm from "antd/es/modal/confirm";
import GroupApi from "../../../../apis/group";
import { GroupModal } from "../../components/GroupModal";
import { Navigate, useNavigate } from "react-router-dom";
import routes from "../../../../constants/routes";
import { PageSize } from "../../../../constants/enum";

const GroupList = () => {
  const [loading, setLoading] = useState(false);
  const [showUpdateGroupModal, setShowUpdateGroupModal] = useState(false);
  const [groupList, setGroupTypeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const groupRef = useRef();
  const navigate = useNavigate();

  const getData = async (search, pageIndex, handleLoading = true) => {
    if (handleLoading) {
      setLoading(true);
    }
    const response = await GroupApi.getAll(search, pageIndex, PageSize.GROUP_LIST);

    setGroupTypeList(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

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
          setShowUpdateGroupModal(true);
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
        return <span>{index + 1 + (currentPage - 1) * PageSize.GROUP_LIST}</span>;
      },
    },
    {
      title: "Tên nhóm",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return (
          <span
            onClick={() => {
              /*showModal(record) */
            }}
          >
            {record.name}
          </span>
        );
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Tổ trưởng",
      dataIndex: "leaderName",
      key: "leaderName",
      render: (_, record) => {
        return (
          <span
            onClick={() => {
              /*showModal(record) */
            }}
          >
            {record.leaderName}
          </span>
        );
      },
      sorter: (a, b) => a.leaderName.localeCompare(b.leaderName),
    },
    {
      title: "Số công nhân",
      dataIndex: "amountWorker",
      key: "amountWorker",
      render: (_, record) => {
        return (
          <span
            onClick={() => {
              /*showModal(record) */
            }}
          >
            {record.amountWorker}
          </span>
        );
      },
      sorter: (a, b) => a.amountWorker - b.amountWorker,
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
    getData(value, 1, true);
  };

  const onPageChange = (current) => {
    setCurrentPage(current);
    getData(null, current, false);
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
          onClick={() => setShowUpdateGroupModal(true)}
        >
          Thêm nhóm
        </Button>
      </Space>
      <BaseTable
        title="Danh sách nhóm"
        dataSource={groupList}
        columns={columns}
        loading={loading}
        pagination={{
          onChange: onPageChange,
          pageSize: PageSize.GROUP_LIST,
          total: groupList?.total,
        }}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm nhóm...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      <GroupModal
        data={groupRef.current}
        open={showUpdateGroupModal}
        onCancel={() => {
          setShowUpdateGroupModal(false);
          groupRef.current = null;
        }}
        onSuccess={() => getData()}
      />
    </>
  );
};

export default GroupList;
