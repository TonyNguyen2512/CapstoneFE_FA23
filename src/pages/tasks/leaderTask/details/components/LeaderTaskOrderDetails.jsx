import React, { useContext, useState } from "react";
import { BaseTable } from "../../../../../components/BaseTable";
import { dateSort, formatDate, formatMoney, formatNum, getTaskStatusColor, getTaskStatusName } from "../../../../../utils";
import { TaskContext } from "../../../../../providers/task";
import { OrderStatus, PageSize, TaskStatus, modalModes } from "../../../../../constants/enum";
import { Table, message } from "antd";
import Dropdown from "antd/lib/dropdown/dropdown";
import { Edit, Forbid, More, PreviewOpen, Unlock } from "@icon-park/react";
import LeaderTasksApi from "../../../../../apis/leader-task";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import routes from "../../../../../constants/routes";
import confirm from "antd/es/modal/confirm";
import { Button } from "antd/lib";
import { LeaderTaskModal } from "../../components/LeaderTaskModal";
import { LeaderTaskReportModal } from "../../components/LeaderTaskReportModal";
import ReportApi from "../../../../../apis/task-report";
import TaskDetailModal from "../../../../../components/modals/task/detail";
import WorkerTasksApi from "../../../../../apis/worker-task";

export const LeaderTaskOrderDetails = ({
  title,
}) => {
  const { info, orderDetails, reload, filterTask } = useContext(TaskContext);
  const isInProgress = info.status === OrderStatus.InProgress;

  const [loading, setLoading] = useState(false);
  const [showETaskCreateModal, setShowETaskCreateModal] = useState(false);
  const [showETaskUpdateModal, setShowETaskUpdateModal] = useState(false);
  const [showETaskReportModal, setShowETaskReportModal] = useState(false);
  const [eTaskCreateLoading, setETaskCreateLoading] = useState(false);
  const [eTaskUpdateLoading, setETaskUpdateLoading] = useState(false);
  const [eTaskReportLoading, setETaskReportLoading] = useState(false);

  const [showWTaskDetailModal, setShowWTaskDetailModal] = useState(false);
  const [wTaskDetailLoading, setWTaskDetaiLoading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchData, setSearchData] = useState("");

  const navigate = useNavigate();

  const orderDetailRef = useRef();
  const eTaskInfoRef = useRef();
  const wTaskInfoRef = useRef();

  /**************
   * ORDER DETAILS
   **************/
  const orderDetailColumns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: "5%",
      // align: "center",
      render: (_, record, index) => {
        return <span>{(index + 1) + (((currentPage) - 1) * ( PageSize.LEADER_TASK_ORDER_DETAIL_LIST))}</span>;
      },
    },
    {
      title: "Loại vật liệu",
      dataIndex: "itemName",
      key: "itemName",
      sorter: (a, b) => a.itemName.localeCompare(b.itemName),
    },
    {
      title: "Mã vật liệu",
      dataIndex: "itemCode",
      key: "itemCode",
      sorter: (a, b) => a.itemCode.localeCompare(b.itemCode),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      sorter: (a, b) => a.quantity.localeCompare(b.quantity),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (price) => {
        const money = formatNum(price);
        return `${formatMoney(money)}`;
      },
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "center",
      render: (totalPrice) => {
        const money = formatNum(totalPrice);
        return `${formatMoney(money)}`;
      },
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, record) => {
        return (
          <Dropdown menu={{ items: getMaterialActionItems(record) }} arrow>
            <Button className="mx-auto flex-center" icon={<More />} />
          </Dropdown>
        );
      },
    },
  ];

  const getMaterialActionItems = (record) => {
    const { id } = record;

    return [
      {
        key: "VIEW_DETAIL",
        label: "Xem thông tin chi tiết",
        icon: <PreviewOpen />,
        onClick: () => {
          eTaskInfoRef.current = record;
          navigate(routes.dashboard.taskOrderDetails + "/" + id, {
            state: {
              orderId: info?.id,
            }
          }, {replace: true});
        },
      },
      isInProgress && {
        key: "CREATE_FOREMAN_TASK",
        label: "Thêm công việc cho nhóm trưởng",
        icon: <Edit />,
        onClick: () => {
          orderDetailRef.current = record;
          setShowETaskCreateModal(true)
        },
      },
    ];
  };

  /**************
   * LEADER TASK
   **************/
  const expandedForemanTaskRowRender = (row) => {
    const columns = [
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
        title: "Ngày bắt đầu",
        dataIndex: "startTime",
        key: "startTime",
        align: "center",
        render: (_, record) => {
          const formattedDate = formatDate(record.startTime, "DD/MM/YYYY");
          return <span>{formattedDate}</span>;
        },
        sorter: (a, b) => dateSort(a.startTime, b.startTime),
      },
      {
        title: "Ngày kết thúc",
        dataIndex: "endTime",
        key: "endTime",
        align: "center",
        render: (_, record) => {
          const formattedDate = formatDate(record.endTime, "DD/MM/YYYY");
          return <span>{formattedDate}</span>;
        },
        sorter: (a, b) => dateSort(a.endTime, b.endTime),
      },
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
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (_, record) => {
          return (
            <span style={{ color: getTaskStatusColor(record.status), fontWeight: "bold" }}>
              {getTaskStatusName(record.status)}
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
            <Dropdown menu={{ items: getETaskActionItems(record) }} arrow>
              <Button className="mx-auto flex-center" icon={<More />} />
            </Dropdown>
          );
        },
      },
    ];

    return <Table
      expandable={{ expandedRowRender: handleWorkerTaskRowRender }}
      columns={columns}
      dataSource={row.leaderTasks}
      rowKey={(record) => record.id}
      pagination={false}
    />;
  };

  const getETaskActionItems = (record) => {
    const { isActive, id } = record;

    return [
      {
        key: "VIEW_DETAIL",
        label: "Xem thông tin chi tiết",
        icon: <PreviewOpen />,
        onClick: () => {
          eTaskInfoRef.current = record;
          navigate(routes.dashboard.workersTasks + "/" + id, {
            state: {
              orderId: info.id
            }
          }, { replace: true });
        },
      },
      {
        key: "UPDATE_ROLE",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          handleShowETaskModal(record?.id);
        },
      },
      {
        key: "REPORT_ROLE",
        label: "Báo cáo công việc",
        icon: <Edit />,
        onClick: () => {
          handleShowETaskReportModal(record?.id);
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
            onOk: () => deleteETaskProcedure(record.id),
            onCancel: () => { },
            closable: true,
          });
        },
      },
    ];
  };

  const handleShowETaskModal = async (foremanTaskId) => {
    if (!foremanTaskId) return;
    const data = await LeaderTasksApi.getLeaderTaskById(foremanTaskId);
    if (data.code === 0) {
      eTaskInfoRef.current = data.data;
      setShowETaskUpdateModal(true);
    } else {
      message.error(data.message);
    }
  }

  const handleSubmitETaskCreate = async (values) => {
    setETaskCreateLoading(true);
    const data = {
      name: values?.name,
      leaderId: values?.leaderId,
      itemId: orderDetailRef.current?.itemId,
      priority: values?.priority,
      itemQuantity: values?.itemQuantity,
      startTime: values.dates?.[0],
      endTime: values.dates?.[1],
      description: values?.description,
      orderId: info.id,
    }
    console.log("orderDetailRef", orderDetailRef)
    console.log("create", data)
    try {
      const create = await LeaderTasksApi.createLeaderTasks(data);
      if (create.code === 0) {
        message.success(create.message);
        setShowETaskCreateModal(false);
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

  const handleSubmitETaskUpdate = async (values) => {
    setETaskUpdateLoading(true);
    const data = {
      id: values?.id,
      name: values?.name,
      leaderId: values?.leaderId,
      priority: values?.priority,
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
        setShowETaskUpdateModal(false);
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

  const deleteETaskProcedure = async (value) => {
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

  const handleShowETaskReportModal = async (eTaskId) => {
    if (!eTaskId) return;
    setShowETaskReportModal(true);
  }

  const handleSubmitETaskReport = async (values) => {
    setETaskReportLoading(true);
    console.log("update task: ", values);
    try {
      const report = await ReportApi.sendAcceptanceReport(values);
      if (report.code === 0) {
        message.success(report.message);
        setShowETaskReportModal(false);
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

  /**************
   * WORKER TASK
   **************/
  const handleWorkerTaskRowRender = (row) => {
    const columns = [
      {
        title: "Tên công việc",
        dataIndex: "name",
        key: "name",
        width: "15.5%",
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: "Nhóm trưởng",
        dataIndex: "leaderName",
        key: "naleaderNameme",
        width: "15.5%",
        sorter: (a, b) => a.leaderName.localeCompare(b.leaderName),
      },
      {
        title: "Ngày bắt đầu",
        dataIndex: "startTime",
        key: "startTime",
        align: "center",
        width: "15.5%",
        render: (_, record) => {
          const formattedDate = formatDate(record.startTime, "DD/MM/YYYY");
          return <span>{formattedDate}</span>;
        },
        sorter: (a, b) => dateSort(a.startTime, b.startTime),
      },
      {
        title: "Ngày kết thúc",
        dataIndex: "endTime",
        key: "endTime",
        align: "center",
        width: "16%",
        render: (_, record) => {
          const formattedDate = formatDate(record.endTime, "DD/MM/YYYY");
          return <span>{formattedDate}</span>;
        },
        sorter: (a, b) => dateSort(a.endTime, b.endTime),
      },
      {
        title: "Độ ưu tiên",
        dataIndex: "priority",
        key: "priority",
        defaultSortOrder: 'ascend',
        // align: "center",
        width: "10.3%",
        render: (_, record) => {
          return <span>{record.priority}</span>;
        },
        sorter: (a, b) => a.priority - b.priority,
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: "15.3%",
        render: (_, record) => {
          return (
            <span style={{ color: getTaskStatusColor(record.status), fontWeight: "bold" }}>
              {getTaskStatusName(record.status)}
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
            <Dropdown menu={{ items: getWTaskActionItems(record) }} arrow>
              <Button className="mx-auto flex-center" icon={<More />} />
            </Dropdown>
          );
        },
      },
    ];

    return <Table
      columns={columns}
      dataSource={row.workerTask}
      rowKey={(record) => record.id}
      pagination={false}
      showHeader={false}
    />;
  };

  const getWTaskActionItems = (record) => {
    return [
      {
        key: "VIEW_DETAIL",
        label: "Xem thông tin chi tiết",
        icon: <PreviewOpen />,
        onClick: () => {
          wTaskInfoRef.current = record;
          setShowWTaskDetailModal(true);
        },
      },
      // {
      //   key: "UPDATE_ROLE",
      //   label: "Cập nhật thông tin",
      //   icon: <Edit />,
      //   onClick: () => {
      //     handleShowETaskModal(record?.id);
      //   },
      // },
      // {
      //   key: "SET_STATUS",
      //   label: isActive ? "Mở khóa" : "Khóa",
      //   danger: !isActive,
      //   icon: !isActive ? <Forbid /> : <Unlock />,
      //   onClick: () => {
      //     confirm({
      //       title: "Xoá tiến độ",
      //       content: `Chắc chắn xoá "${record.name}"?`,
      //       type: "confirm",
      //       cancelText: "Hủy",
      //       onOk: () => deleteETaskProcedure(record.id),
      //       onCancel: () => { },
      //       closable: true,
      //     });
      //   },
      // },
    ];
  };

  const handleSubmitWTaskUpdate = async (values) => {
    setWTaskDetaiLoading(true);
    let resp = null;
    if (values.status !== TaskStatus.Pending) {
      console.log("update task: ", values);
      resp = await WorkerTasksApi.updateWorkerTask(values);
    } else {
      console.log("send feedback task: ", values);
      resp = await WorkerTasksApi.sendFeedback(values);
    }
    if (resp?.code === 0) {
      message.success(resp?.message);
      reload(false);
      setShowWTaskDetailModal(false);
    } else {
      message.error(resp?.message);
    }
    setWTaskDetaiLoading(false);
  };

  /**
   * TABLE
   */
  const handleSearch = (value) => {
    setSearchData(value);
    filterTask(1, value);
  };

  const onExpand = (expanded, record) => {
    if (expanded) {
      orderDetailRef.current = record;
    } else {
      orderDetailRef.current = null;
    }
  }

  const onPageChange = (current) => {
    setCurrentPage(current);
    filterTask(current, searchData);
  };

  return (
    <>
      <BaseTable
        title={title}
        dataSource={orderDetails?.data}
        columns={orderDetailColumns}
        loading={loading}
        pagination={{
          onChange: onPageChange,
          pageSize: PageSize.LEADER_TASK_ORDER_DETAIL_LIST,
          total: orderDetails?.total,
        }}
        rowKey={(record) => record.id}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm vật liệu...",
          onSearch: handleSearch,
          width: 300,
        }}
        expandable={{
          expandedRowRender: expandedForemanTaskRowRender,
          onExpand: onExpand,
        }}
      />
      <LeaderTaskModal
        open={showETaskCreateModal}
        onCancel={() => {
          eTaskInfoRef.current = null;
          setShowETaskCreateModal(false);
        }}
        onSubmit={handleSubmitETaskCreate}
        confirmLoading={eTaskCreateLoading}
        dataSource={[]}
        mode={modalModes.CREATE}
      />
      <LeaderTaskModal
        open={showETaskUpdateModal}
        onCancel={() => {
          eTaskInfoRef.current = null;
          setShowETaskUpdateModal(false);
        }}
        onSubmit={handleSubmitETaskUpdate}
        confirmLoading={eTaskUpdateLoading}
        dataSource={eTaskInfoRef.current}
        mode={modalModes.UPDATE}
        message={message}
      />
      <LeaderTaskReportModal
        open={showETaskReportModal}
        onCancel={() => {
          eTaskInfoRef.current = null;
          setShowETaskReportModal(false);
        }}
        onSubmit={handleSubmitETaskReport}
        confirmLoading={eTaskReportLoading}
        message={message}
        title="Báo cáo công việc"
      />
      <TaskDetailModal
        open={showWTaskDetailModal}
        onCancel={() => setShowWTaskDetailModal(false)}
        onSubmit={handleSubmitWTaskUpdate}
        confirmLoading={wTaskDetailLoading}
        task={wTaskInfoRef.current}
      />
    </>
  );
};
