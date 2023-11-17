import { Edit, Forbid, More, Unlock, Plus } from "@icon-park/react";
import { Typography, Row, message } from "antd";
import dayjs from "dayjs";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseTable } from "../../../../../components/BaseTable";
import confirm from "antd/es/modal/confirm";
import Dropdown from "antd/lib/dropdown/dropdown";
import { Button } from "antd/lib";
import { LeaderTaskProcedureModal } from "./LeaderTaskProcedureModal";
import { OrderStatus, eTaskColors, eTaskLabels, eTaskStatus, modalModes } from "../../../../../constants/enum";
import LeaderTasksApi from "../../../../../apis/leader-task";
import { TeamContext } from "../../../../../providers/team";

export const LeaderTaskProcedure = ({
  title,
  orderInfo,
  dataSource,
  reloadData,
}) => {

  const { reload } = useContext(TeamContext);

  const { Title } = Typography;
  const [taskList, setTaskList] = useState([]);
  const [titleInfo, setTitleInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [eTaskCreateLoading, setETaskCreateLoading] = useState(false);
  const [eTaskUpdateLoading, setETaskUpdateLoading] = useState(false);

  const leaderTaskInfo = useRef();

  useEffect(() => {
    setTaskList(dataSource?.data);
    setTitleInfo(title + ` (${taskList ? taskList?.length : 0})`)
  });

  const getActionItems = (record) => {
    const { isActive, id } = record;

    return [
      // {
      //   key: "VIEW_DETAIL",
      //   label: "Xem thông tin chi tiết",
      //   icon: <PreviewOpen />,
      //   onClick: () => {
      //     procedureRef.current = record;
      //   },
      // },
      {
        key: "UPDATE_ROLE",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          leaderTaskInfo.current = record;
          setShowUpdateModal(true);
        },
      },
      {
        key: "SET_STATUS",
        label: isActive ? "Mở khóa" : "Khóa",
        danger: !isActive,
        icon: !isActive ? <Forbid /> : <Unlock />,
        onClick: () => {
          confirm({
            title: "Xoá tiến độ",
            content: `Chắc chắn xoá "${record.name}"?`,
            type: "confirm",
            cancelText: "Hủy",
            onOk: () => deleteTaskProcedure(record.id),
            onCancel: () => { },
            closable: true,
          });
        },
      },
    ];
  };

  const getProcedureStatus = (status) => {
    return eTaskLabels[status] || "Không Xác Định";
  };

  const getProcedureStatusColor = (status) => {
    return eTaskColors[status] || "#FF0000";
  };

  const columns = [
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      defaultSortOrder: 'ascend',
      // align: "center",
      render: (_, record) => {
        return <span>{record.priority}</span>;
      },
      sorter: (a, b) => a.priority - b.priority,
    },
    {
      title: "Tên công việc",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Nhóm trưởng",
      dataIndex: "leaderName",
      key: "leaderName",
      sorter: (a, b) => a.leaderName.localeCompare(b.leaderName),
    },
    {
      title: "Sản phẩm",
      dataIndex: "itemName",
      key: "itemName",
      sorter: (a, b) => a.itemName.localeCompare(b.itemName),
    },
    // {
    //   title: "Mô tả",
    //   dataIndex: "description",
    //   key: "description",
    //   align: "center",
    //   render: (_, record) => {
    //     return <span>{record.description}</span>;
    //   },
    //   sorter: (a, b) => a.description.localeCompare(b.description),
    //   width: 300,
    // },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      align: "center",
      render: (_, record) => {
        const formattedDate = dayjs(record.startTime).format("DD/MM/YYYY");
        return <span>{formattedDate}</span>;
      },
      sorter: (a, b) => a.startTime.localeCompare(b.startTime),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endTime",
      key: "endTime",
      align: "center",
      render: (_, record) => {
        const formattedDate = dayjs(record.endTime).format("DD/MM/YYYY");
        return <span>{formattedDate}</span>;
      },
      sorter: (a, b) => a.endTime.localeCompare(b.endTime),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        return (
          <span style={{ color: getProcedureStatusColor(record.status), fontWeight: "bold" }}>
            {getProcedureStatus(record.status)}
          </span>
        );
      },
      sorter: (a, b) => a.status - b.status,
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
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
  };

  const handleSubmitCreate = async (values) => {
    setETaskCreateLoading(true);
    const data = {
      name: values?.name,
      leaderId: values?.leaderId,
      itemId: values?.itemId,
      priority: values?.priority,
      itemQuantity: values?.itemQuantity,
      startTime: values.dates?.[0],
      endTime: values.dates?.[1],
      description: values?.description,
      orderId: orderInfo?.id,
    }
    const create = await LeaderTasksApi.createLeaderTasks(data);
    if (create.code === 0) {
      message.success(create.message);
      setShowCreateModal(false);
      reloadData();
    } else {
      console.log("create", create)
      message.error(create.message);
    }
    setETaskCreateLoading(false);
  };

  const handleSubmitUpdate = async (values) => {
    setETaskUpdateLoading(true);
    const data = {
      id: values?.id,
      name: values?.name,
      priority: values?.priority,
      itemQuantity: values?.itemQuantity,
      startTime: values.dates?.[0],
      endTime: values.dates?.[1],
      description: values?.description,
      status: values?.status,
    }
    console.log("update task: ", data);
    const update = await LeaderTasksApi.updateLeaderTasks(data);
    if (update.code === 0) {
      message.success(update.message);
      setShowUpdateModal(false);
      reloadData();
    } else {
      message.error(update.message);
    }
    setETaskUpdateLoading(false);
  };

  const deleteTaskProcedure = async (value) => {
    setLoading(true);
    const success = await LeaderTasksApi.deleteLeaderTasks(value);
    if (success) {
      message.success(success.message);
    } else {
      message.error(success.message);
    }
    reloadData();
    setLoading(false);
  };

  return (
    <>
      <Row align="middle" className="mb-3" justify="space-between">
        <Row align="middle">
          <Title level={4} style={{ margin: 0 }}>
            {titleInfo}
          </Title>
          {orderInfo?.status === OrderStatus.InProgress &&
            <Button
              icon={<Plus />}
              className="flex-center ml-3"
              shape="circle"
              type="primary"
              onClick={() => setShowCreateModal(true)}
            />
          }
        </Row>
      </Row>
      <BaseTable
        dataSource={taskList}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 3 }}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm vật liệu...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      <LeaderTaskProcedureModal
        open={showCreateModal}
        onCancel={() => {
          leaderTaskInfo.current = null;
          setShowCreateModal(false);
        }}
        onSubmit={handleSubmitCreate}
        confirmLoading={eTaskCreateLoading}
        dataSource={[]}
        mode={modalModes.CREATE}
      />
      <LeaderTaskProcedureModal
        open={showUpdateModal}
        onCancel={() => {
          leaderTaskInfo.current = null;
          setShowUpdateModal(false);
        }}
        onSubmit={handleSubmitUpdate}
        confirmLoading={eTaskUpdateLoading}
        dataSource={leaderTaskInfo.current}
        mode={modalModes.UPDATE}
        message={message}
      />
    </>
  );
};
