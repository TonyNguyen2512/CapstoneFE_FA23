import React, { useContext, useState } from "react";
import { BaseTable } from "../../../../../components/BaseTable";
import { dateSort, formatDate, formatMoney, formatNum, getEStatusColor, getEStatusName } from "../../../../../utils";
import { TaskContext } from "../../../../../providers/task";
import { PageSize, eTaskStatus, modalModes } from "../../../../../constants/enum";
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
  const { info, orderDetails, reload } = useContext(TaskContext);

  const [loading, setLoading] = useState(false);
  const [showETaskCreateModal, setShowETaskCreateModal] = useState(false);
  const [showETaskUpdateModal, setShowETaskUpdateModal] = useState(false);
  const [showETaskReportModal, setShowETaskReportModal] = useState(false);
  const [eTaskCreateLoading, setETaskCreateLoading] = useState(false);
  const [eTaskUpdateLoading, setETaskUpdateLoading] = useState(false);
  const [eTaskReportLoading, setETaskReportLoading] = useState(false);

  const [showWTaskDetailModal, setShowWTaskDetailModal] = useState(false);
  const [wTaskDetailLoading, setWTaskDetaiLoading] = useState(false);

  const [leaderTaskInfo, setLeaderTaskInfo] = useState([]);
  const [workerTaskInfo, setWorkerTaskInfo] = useState([]);

  const navigate = useNavigate();

  const eTaskInfo = useRef();
  const wTaskInfo = useRef();

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
        return <span>{index + 1}</span>;
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
          eTaskInfo.current = record;
          navigate(routes.dashboard.taskOrderDetails + "/" + id, {
            state: {
              orderId: info?.id,
            }
          }, {replace: true});
        },
      },
      {
        key: "CREATE_FOREMAN_TASK",
        label: "Thêm công việc cho nhóm trưởng",
        icon: <Edit />,
        onClick: () => setShowETaskCreateModal(true),
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
            <Dropdown menu={{ items: getETaskActionItems(record) }} arrow>
              <Button className="mx-auto flex-center" icon={<More />} />
            </Dropdown>
          );
        },
      },
    ];

    const data = [{
      "id": "fe35fd05-86d6-4973-4e64-08dbf0de1b11",
      "leaderId": "667d28a5-1a98-4339-309c-08dbed94536d",
      "leaderName": "dattqaaaaa",
      "createdById": "add09bcf-e666-4b7e-963a-08dbdaa1e63e",
      "createdByName": "Quang Dat",
      "orderId": "35f7b528-f4d6-414d-9cc5-08dbf0dd82de",
      "orderName": "Trần Đạt",
      "itemId": "521c8b7b-5e0e-44e4-17b4-08dbf0dcb6bc",
      "item": {
        "id": "521c8b7b-5e0e-44e4-17b4-08dbf0dcb6bc",
        "itemCategoryId": "04e3bc0e-2b41-4fe6-ec37-08dbdb62d668",
        "itemCategory": null,
        "name": "Sản phẩm 1",
        "code": "272624",
        "image": "https://firebasestorage.googleapis.com/v0/b/capstonebwm.appspot.com/o/Picture%2Fno_photo.jpg?alt=media&token=3dee5e48-234a-44a1-affa-92c8cc4de565&_gl=1*bxxcv*_ga*NzMzMjUwODQ2LjE2OTY2NTU2NjA.*_ga_CW55HF8NVT*MTY5ODIyMjgyNC40LjEuMTY5ODIyMzIzNy41Ny4wLjA&fbclid=IwAR0aZK4I3ay2MwA-5AyI-cqz5cGAMFcbwoAiMBHYe8TEim-UTtlbREbrCS0",
        "length": 1,
        "depth": 1,
        "height": 1,
        "unit": "mét",
        "mass": 1,
        "drawingsTechnical": "",
        "drawings2D": "",
        "drawings3D": "",
        "description": "Thêm/ Cập nhật sản phẩm",
        "price": 2000,
        "isDeleted": false,
        "procedureItems": [],
        "orderDetails": [],
        "itemMaterials": []
      },
      "name": "string",
      "priority": 5,
      "itemQuantity": 0,
      "itemCompleted": null,
      "itemFailed": null,
      "startTime": "2100-01-02T17:00:00",
      "endTime": "2100-01-22T13:37:11",
      "completedTime": null,
      "listReportInTasks": [],
      "listWorkerTasks": null,
      "status": 1,
      "description": null,
      "isDeleted": false
    }]
    return <Table
      expandable={{ expandedRowRender: handleWorkerTaskRowRender }}
      columns={columns}
      dataSource={row.leaderTasks}
      rowKey={(record) => record.leaderTaskId}
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
          eTaskInfo.current = record;
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
      console.log("data detail", data.data)
      eTaskInfo.current = data.data;
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
        sorter: (a, b) => a.name.localeCompare(b.name),
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
            <Dropdown menu={{ items: getWTaskActionItems(record) }} arrow>
              <Button className="mx-auto flex-center" icon={<More />} />
            </Dropdown>
          );
        },
      },
    ];

    const data = [{
      "id": "56362af4-504c-4a63-36c0-08dbf08f7327",
      "createById": "5f8fa49d-0ab2-4e75-3904-08dbe4ce4a9f",
      "createByName": "Foreman Manager Task",
      "leaderTaskId": "408bc786-bd5a-4924-6d2b-08dbed8fed2c",
      "leaderTaskName": "123",
      "item": {
        "id": "55308082-31ba-4187-82e3-08dbd9572a32",
        "itemCategoryId": "04e3bc0e-2b41-4fe6-ec37-08dbdb62d668",
        "itemCategory": null,
        "name": "string",
        "code": "016079",
        "image": "string",
        "length": 10,
        "depth": 10,
        "height": 10,
        "unit": "string",
        "mass": 10,
        "drawingsTechnical": "string",
        "drawings2D": "string",
        "drawings3D": "string",
        "description": "string",
        "price": 0,
        "isDeleted": false,
        "procedureItems": [],
        "orderDetails": [],
        "itemMaterials": []
      },
      "name": "Worker Task 2",
      "priority": 2,
      "startTime": "2023-11-29T04:28:42.75",
      "endTime": "2023-11-30T04:28:43.75",
      "completeTime": null,
      "description": "<p>a</p>",
      "status": 0,
      "isDeleted": false,
      "members": [
        {
          "memberId": "7a8d0361-c4ff-42a1-cd36-08dbef22c51b",
          "memberFullName": "1"
        }
      ],
      "feedbackTitle": null,
      "feedbackContent": null,
      "resource": []
    }]
    return <Table
      columns={columns}
      dataSource={row.workerTasks}
      rowKey={(record) => record.workerTaskId}
      pagination={false}
    />;
  };

  const getWTaskActionItems = (record) => {
    const { id } = record;

    return [
      {
        key: "VIEW_DETAIL",
        label: "Xem thông tin chi tiết",
        icon: <PreviewOpen />,
        onClick: () => {
          wTaskInfo.current = record;
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
    if (values.status !== eTaskStatus.Pending) {
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

  const handleSearch = (value) => {
    // filterMaterial(value);
  };

  return (
    <>
      <BaseTable
        title={title}
        dataSource={orderDetails}
        columns={orderDetailColumns}
        loading={loading}
        pagination={{ pageSize: PageSize.LEADER_TASK_ORDER_DETAIL_LIST }}
        rowKey={(record) => record.id}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm vật liệu...",
          onSearch: handleSearch,
          width: 300,
        }}
        expandable={{
          expandedRowRender: expandedForemanTaskRowRender
        }}
      />
      <LeaderTaskModal
        open={showETaskCreateModal}
        onCancel={() => {
          eTaskInfo.current = null;
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
          eTaskInfo.current = null;
          setShowETaskUpdateModal(false);
        }}
        onSubmit={handleSubmitETaskUpdate}
        confirmLoading={eTaskUpdateLoading}
        dataSource={eTaskInfo.current}
        mode={modalModes.UPDATE}
        message={message}
      />
      <LeaderTaskReportModal
        open={showETaskReportModal}
        onCancel={() => {
          eTaskInfo.current = null;
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
        task={wTaskInfo.current}
      />
    </>
  );
};
