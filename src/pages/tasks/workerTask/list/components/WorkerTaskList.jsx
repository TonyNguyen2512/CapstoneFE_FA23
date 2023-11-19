import { Edit, Forbid, More, PreviewOpen, Unlock } from "@icon-park/react";
import { Button, Dropdown, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { enumTaskStatuses, mockTasks } from "../../../../../__mocks__/jama/tasks";
import { message } from "antd/lib";
import dayjs from "dayjs";
import confirm from "antd/es/modal/confirm";
import ManagerTaskApi from "../../../../../apis/leader-task";
import { BaseTable } from "../../../../../components/BaseTable";
import { useNavigate, useParams } from "react-router-dom";
import GroupApi from "../../../../../apis/group";
import UserApi from "../../../../../apis/user";
import LeaderTasksApi from "../../../../../apis/leader-task";
import WorkerTasksApi from "../../../../../apis/worker-task";

const WorkerTaskList = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const [leaderTasksInfo, setLeaderTasksInfo] = useState([]);

  const navigate = useNavigate();

  const taskRef = useRef();
  const userRef = useRef();
  // const rolesRef = useRef();

  const getData = async (taskId, handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }
    // retrieve leader task data by id
    const dataLeaderTasks = await LeaderTasksApi.getAll();

    setLeaderTasksInfo(dataLeaderTasks);

    setLoading(false);
  };

  const deleteTaskCategory = async (value) => {
    setLoading(true);
    const success = await ManagerTaskApi.deleteTaskCategory(value);
    if (success) {
      message.success("Xoá thành công");
    } else {
      message.error("Xoá thất bại");
    }
    getData();
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  

  const handleSubmitCreate = async (values) => {
    console.log("create task: ", values);
    // const projectId = team?.project?.id;
    // const request = {
    // 	projectId: projectId,
    // 	taskName: values?.taskName,
    // 	startTime: values?.startTime,
    // 	endTime: values?.endTime,
    // 	taskDescription: values?.taskDescription,
    // 	status: values?.status,
    // 	assignees: values?.assignees,
    // };
    // setTaskCreating(true);
    // const success = await TaskApi.createTask(request);
    // if (success) {
    // 	message.success("Đã tạo công việc");
    // 	reload(false);
    // } else {
    // 	message.error("Có lỗi xảy ra");
    // }
    // setMaterial(values);
    // console.log(material);
    // setTaskCreateLoading(false);
    // setShowCreateModal(false);
    // setShowCreateModal(false);
  };

  const handleSubmitUpdate = async (values) => {
    console.log("update task: ", values);
    // setProcedureUpdating(true);
    // const success = await TaskApi.updateTask(values);
    // if (success) {
    // 	message.success("Đã cập nhật công việc");
    // 	reload(false);
    // } else {
    // 	message.error("Có lỗi xảy ra");
    // }
    // setProcedureUpdating(false);
    // setShowDetailModal(false);
    // setTaskUpdateLoading(false);
    // setShowUpdateModal(false);
  };

  const getActionItems = (record) => {
    const { isActive, id } = record;

    return [
      {
        key: "VIEW_DETAIL",
        label: "Xem thông tin chi tiết",
        icon: <PreviewOpen />,
        onClick: () => {
          // userRef.current = record;
          navigate(id);
        },
      },
      // {
      //   key: "UPDATE_ROLE",
      //   label: "Cập nhật thông tin",
      //   icon: <Edit />,
      //   onClick: () => {
      //     taskRef.current = record;
      //     // setShowUpdateModal(true);
      //     navigate(routes.dashboard.workersTasks + "/" + record?.id)
      //   },
      // },
      {
        key: "SET_STATUS",
        label: isActive ? "Mở khóa" : "Khóa",
        danger: !isActive,
        icon: !isActive ? <Forbid /> : <Unlock />,
        onClick: () => {
          confirm({
            title: "Xoá công việc",
            content: `Chắc chắn xoá "${record.name}"?`,
            type: "confirm",

            cancelText: "Hủy",
            onOk: () => deleteTaskCategory(record.id),
            onCancel: () => { },
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
      title: "Tên đơn hàng",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Nhóm",
      dataIndex: "team",
      key: "team",
      align: "center",
      sorter: (a, b) => a.team.localeCompare(b.team),
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "timeStart",
      key: "timeStart",
      align: "center",
      render: (_, record) => {
        const formattedDate = dayjs(record.timeStart).format("DD/MM/YYYY");
        return <span>{formattedDate}</span>;
      },
      sorter: (a, b) => dateSort(a.timeStart, b.timeStart),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "timeEnd",
      key: "timeEnd",
      align: "center",
      render: (_, record) => {
        const formattedDate = dayjs(record.timeEnd).format("DD/MM/YYYY");
        return <span>{formattedDate}</span>;
      },
      sorter: (a, b) => dateSort(a.timeEnd, b.timeEnd),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, record) => {
        return (
          <span style={{ color: getTaskStatusColor(record.status) }}>
            {getTaskStatus(record.status)}
          </span>
        );
      },
      sorter: (a, b) => a.status - b.status,
    },
    {
      title: "Thao tác",
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

  const dateSort = (dateA, dateB) => {
    return dayjs(dateA).isAfter(dayjs(dateB)) ? 1 : dayjs(dateA).isBefore(dayjs(dateB)) ? -1 : 0;
  }

  const getTaskStatus = (status) => {
    return enumTaskStatuses[status]?.name || "Không Xác Định";
  };

  const getTaskStatusColor = (status) => {
    return enumTaskStatuses[status]?.color || "#FF0000";
  };

  const handleSearch = (value) => {
    getData(value);
  };

  return (
    <>
      <Space className="w-full flex justify-between mb-6">
        <div></div>
        <Button
          className="btn-primary app-bg-primary font-semibold text-white"
          type="primary"
          // onClick={() => setShowCreateModal(true)}
        >
          Thêm vật liệu
      </Button>
      </Space>
      <BaseTable
        title="Danh sách công việc"
        dataSource={leaderTasksInfo}
        columns={columns}
        loading={loading}
        pagination={true}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm công việc...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      
      {/* <ManagerTaskModal
        open={showCreateModal}
        onCancel={() => {
          setShowCreateModal(false);
          taskRef.current = null;
        }}
        onSubmit={handleSubmitCreate}
        confirmLoading={taskCreateLoading}
        mode="1"
      />
      <ManagerTaskModal
        open={showUpdateModal}
        onCancel={() => {
          setShowUpdateModal(false);
          taskRef.current = null;
        }}
        onSubmit={handleSubmitUpdate}
        confirmLoading={taskUpdateLoading}
        dataSource={taskRef.current}
        mode="2"
      /> */}
    </>
  );
};

export default WorkerTaskList;
