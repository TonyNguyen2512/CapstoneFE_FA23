import { Edit, Forbid, More, Unlock, Plus, PreviewOpen } from "@icon-park/react";
import { Typography, Row, message } from "antd";
import dayjs from "dayjs";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseTable } from "../../../../../../../components/BaseTable";
import confirm from "antd/es/modal/confirm";
import Dropdown from "antd/lib/dropdown/dropdown";
import { Button } from "antd/lib";
import { OrderStatus, PageSize, modalModes } from "../../../../../../../constants/enum";
import LeaderTasksApi from "../../../../../../../apis/leader-task";
import routes from "../../../../../../../constants/routes";
import { TaskContext } from "../../../../../../../providers/task";
import { LeaderTaskModal } from "../../../../components/LeaderTaskModal";
import ReportApi from "../../../../../../../apis/task-report";
import { LeaderTaskReportModal } from "../../../../components/LeaderTaskReportModal";
import { getEStatusColor, getEStatusName } from "../../../../../../../utils";

export const LeaderTaskOrderDetailProcedure = ({
  title,
  orderId,
}) => {

  const { tasks, info, reload, filterTask } = useContext(TaskContext);

  const { Title } = Typography;
  const [titleInfo, setTitleInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [eTaskCreateLoading, setETaskCreateLoading] = useState(false);
  const [eTaskUpdateLoading, setETaskUpdateLoading] = useState(false);
  const [eTaskReportLoading, setETaskReportLoading] = useState(false);

  const leaderTaskInfo = useRef();

  useEffect(() => {
    setTitleInfo(title + ` (${tasks?.total ? tasks.total : 0})`)
  });

  const getActionItems = (record) => {
    const { isActive, id } = record;

    return [
      {
        key: "VIEW_DETAIL",
        label: "Xem thông tin chi tiết",
        icon: <PreviewOpen />,
        onClick: () => {
          leaderTaskInfo.current = record;
          navigate(routes.dashboard.workersTasks + "/" + id, {
            state: {
              orderId: orderId,
              orderDetailId: info.id,
            }
          }, { replace: true });
        },
      },
      {
        key: "UPDATE_ROLE",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          handleShowModal(record?.id);
        },
      },
      {
        key: "REPORT_ROLE",
        label: "Báo cáo công việc",
        icon: <Edit />,
        onClick: () => {
          handleShowReportModal(record?.id);
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

  const handleShowReportModal = async (eTaskId) => {
    if (!eTaskId) return;
    setShowReportModal(true);
  }

  const handleShowModal = async (eTaskId) => {
    if (!eTaskId) return;
    const data = await LeaderTasksApi.getLeaderTaskById(eTaskId);
    if (data.code === 0) {
      console.log("data detail", data.data)
      leaderTaskInfo.current = data.data;
      setShowUpdateModal(true);
    } else {
      message.error(data.message);
    }
  }

  const columns = [
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      defaultSortOrder: 'ascend',
      // align: "center",
      width: "10%",
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
      title: "Tổ trưởng",
      dataIndex: "leaderName",
      key: "leaderName",
      sorter: (a, b) => a.leaderName.localeCompare(b.leaderName),
    },
    {
      title: "Sản phẩm",
      dataIndex: "itemName",
      key: "itemName",
      sorter: (a, b) => a.itemName.localeCompare(b.itemName),
      render: (_, record) => {
        return <span>{record?.item?.name}</span>;
      },
    },
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
          <span style={{ color: getEStatusColor(record.status), fontWeight: "bold" }}>
            {getEStatusName(record.status)}
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
    filterTask(value, 1);
  };

  const onPageChange = (current) => {
    filterTask(null, current);
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
      orderId: info.id,
    }
    console.log("create", data)
    try {
      const create = await LeaderTasksApi.createLeaderTasks(data);
      if (create.code === 0) {
        message.success(create.message);
        setShowCreateModal(false);
        reload(false);
      } else {
        message.error(create.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setETaskCreateLoading(false);
    }
  };

  const handleSubmitUpdate = async (values) => {
    setETaskUpdateLoading(true);
    const data = {
      id: values?.id,
      name: values?.name,
      leaderId: values?.leaderId,
      priority: values?.priority,
      leaderId: values?.leaderId,
      itemQuantity: values?.itemQuantity,
      startTime: values.dates?.[0],
      endTime: values.dates?.[1],
      description: values?.description,
      status: values?.status,
    }
    try {
      console.log("update task: ", data);
      const update = await LeaderTasksApi.updateLeaderTasks(data);
      if (update.code === 0) {
        message.success(update.message);
        setShowUpdateModal(false);
        reload(false);
      } else {
        message.error(update.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setETaskUpdateLoading(false);
    }
  };

  const handleSubmitReport = async (values) => {
    setETaskReportLoading(true);
    console.log("update task: ", values);
    try {
      const report = await ReportApi.sendAcceptanceReport(values);
      if (report.code === 0) {
        message.success(report.message);
        setShowReportModal(false);
        reload(false);
      } else {
        message.error(report.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setETaskReportLoading(false);
    }
  };

  const deleteTaskProcedure = async (value) => {
    setLoading(true);
    try {
      const success = await LeaderTasksApi.deleteLeaderTasks(value);
      if (success) {
        message.success(success.message);
        reload(false);
      } else {
        message.error(success.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Row align="middle" className="mb-3" justify="space-between">
        <Row align="middle">
          <Title level={4} style={{ margin: 0 }}>
            {titleInfo}
          </Title>
          {info?.status === OrderStatus.InProgress &&
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
        dataSource={tasks?.data}
        columns={columns}
        loading={loading}
        pagination={{ 
          onChange: onPageChange,
          pageSize: PageSize.LEADER_TASK_PROCEDURE_LIST,
          total: tasks?.total,
         }}
        rowKey={(record) => record.id}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm công việc...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      <LeaderTaskModal
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
      <LeaderTaskModal
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
      <LeaderTaskReportModal
        open={showReportModal}
        onCancel={() => {
          leaderTaskInfo.current = null;
          setShowReportModal(false);
        }}
        onSubmit={handleSubmitReport}
        confirmLoading={eTaskReportLoading}
        message={message}
        title="Báo cáo công việc"
      />
    </>
  );
};
