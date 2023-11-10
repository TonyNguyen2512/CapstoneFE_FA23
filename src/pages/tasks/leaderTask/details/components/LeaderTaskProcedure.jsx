import { Edit, Forbid, More, PreviewOpen, Unlock, Plus } from "@icon-park/react";
import { Typography, Row } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseTable } from "../../../../../components/BaseTable";
import { mockMaterials } from "../../../../../__mocks__/jama/materials";
import confirm from "antd/es/modal/confirm";
import Dropdown from "antd/lib/dropdown/dropdown";
import { Button } from "antd/lib";
import { enumProcedureStatus } from "../../../../../__mocks__/jama/procedures";
import { LeaderTaskProcedureModal } from "./LeaderTaskProcedureModal";

export const LeaderTaskProcedure = ({
  title,
  dataSource
}) => {
  const { Title } = Typography;
  const [taskList, setTaskList] = useState([]);
  const [titleInfo, setTitleInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [procedureCreating, setProcedureCreating] = useState(false);
  const [procedureUpdating, setProcedureUpdating] = useState(false);

  const procedureRef = useRef();

  useEffect(() => {
    setTaskList(dataSource?.data);
    setTitleInfo(title + ` (${taskList?.length})`)
  });


  const getData = async (keyword) => {
    setLoading(true);
    console.log("keyword ", keyword)
    const data = mockMaterials.filter(x => x.name.indexOf(keyword) > -1);
    console.log("search: ", data)
    setTaskList(data);
    setLoading(false);
  };

  const getActionItems = (record) => {
    const { isActive, id } = record;

    return [
      // {
      //   key: "VIEW_DETAIL",
      //   label: "Xem thông tin chi tiết",
      //   icon: <PreviewOpen />,
      //   onClick: () => {
      //     procedureRef.current = record;
      //     // navigate(record?.id)
      //     setShowDetailModal(true);
      //   },
      // },
      {
        key: "UPDATE_ROLE",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          procedureRef.current = record;
          setShowDetailModal(true);
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

  const deleteTaskProcedure = async (value) => {
    setLoading(true);
    // const success = await LeaderTaskApi.deleteTaskCategory(value);
    // if (success) {
    //   message.success("Xoá thành công");
    // } else {
    //   message.error("Xoá thất bại");
    // }
    getData();
    setLoading(false);
  };

  const getProcedureStatus = (status) => {
    return enumProcedureStatus.find(x => x.id === status)?.name || "Không Xác Định";
  };

  const getProcedureStatusColor = (status) => {
    return enumProcedureStatus.find(x => x.id === status)?.color || "#FF0000";
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
      title: "Tên công việc",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      align: "center",
      sorter: (a, b) => a.description.localeCompare(b.description),
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
      align: "center",
      render: (_, record) => {
        return (
          <span style={{ color: getProcedureStatusColor(record.status) }}>
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
    getData(value);
  };

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
    setTaskList(values);
    console.log(taskList);
    setProcedureCreating(false);
    setShowCreateModal(false);
  };

  const handleSubmitUpdate = async (values) => {
    console.log("update task: ", values);
    setProcedureUpdating(true);
    // const success = await TaskApi.updateTask(values);
    // if (success) {
    // 	message.success("Đã cập nhật công việc");
    // 	reload(false);
    // } else {
    // 	message.error("Có lỗi xảy ra");
    // }
    setProcedureUpdating(false);
    setShowDetailModal(false);
  };

  return (
    <>
      <Row align="middle" className="mb-3" justify="space-between">
        <Row align="middle">
          <Title level={4} style={{ margin: 0 }}>
            {titleInfo}
          </Title>
          <Button
            icon={<Plus />}
            className="flex-center ml-3"
            shape="circle"
            type="primary"
            onClick={() => setShowCreateModal(true)}
          />
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
          setShowCreateModal(false);
          procedureRef.current = null;
        }}
        onSubmit={handleSubmitCreate}
        confirmLoading={procedureCreating}
        mode="1"
      />
      <LeaderTaskProcedureModal
        open={showDetailModal}
        onCancel={() => {
          setShowDetailModal(false);
          procedureRef.current = null;
        }}
        onSubmit={handleSubmitUpdate}
        confirmLoading={procedureUpdating}
        dataSource={procedureRef.current}
        mode="2"
      />
    </>
  );
};
