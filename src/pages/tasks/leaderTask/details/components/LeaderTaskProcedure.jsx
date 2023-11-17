import { Edit, Forbid, More, PreviewOpen, Unlock, Plus } from "@icon-park/react";
import { Typography, Row, message } from "antd";
import dayjs from "dayjs";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseTable } from "../../../../../components/BaseTable";
import { mockMaterials } from "../../../../../__mocks__/jama/materials";
import confirm from "antd/es/modal/confirm";
import Dropdown from "antd/lib/dropdown/dropdown";
import { Button } from "antd/lib";
import { enumProcedureStatus } from "../../../../../__mocks__/jama/procedures";
import { LeaderTaskProcedureModal } from "./LeaderTaskProcedureModal";
import { eTaskColors, eTaskLabels, modalModes } from "../../../../../constants/enum";
import LeaderTasksApi from "../../../../../apis/leader-task";
import { TeamContext } from "../../../../../providers/team";
import ApiCodes from "../../../../../constants/apiCode";

export const LeaderTaskProcedure = ({
  title,
  orderId,
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
    setTitleInfo(title + ` (${taskList?.length})`)
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
          // procedureRef.current = record;
          console.log("record id: ", record?.id);
          handleLeaderTaskModal(record?.id);
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
      fixed: 'left',
    },
    // {
    //   title: "Quy trình",
    //   dataIndex: "procedureName",
    //   key: "procedureName",
    //   sorter: (a, b) => a.procedureName.localeCompare(b.procedureName),
    //   fixed: 'left',
    // },
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
  };

  const handleLeaderTaskModal = async (eTaskId) => {
		console.log("call eTaskId", eTaskId)
		const leaderTaskData = await LeaderTasksApi.getLeaderTaskById(eTaskId);
    if (leaderTaskData.code === 0) {
      leaderTaskInfo.current = leaderTaskData.data;
      setShowUpdateModal(true);
    } else {
      setShowUpdateModal(false);
      message.error(leaderTaskData.message);
    }
  }

  const handleSubmitCreate = async (values) => {
    setETaskCreateLoading(true);
    values.orderId = orderId;
    console.log("create task: ", values);
    const create = await LeaderTasksApi.createLeaderTasks(values);
    if (create.code === 0) {
			message.success(create.message);
      setShowCreateModal(false);
      reloadData();
		} else {
			message.error(create.message);
		}
    setETaskCreateLoading(false);
  };

  const handleSubmitUpdate = async (values) => {
    setETaskUpdateLoading(true);
    console.log("update task: ", values);
    const update = await LeaderTasksApi.updateLeaderTasks(values);
    if (update.code === 0) {
			message.success(update.message);
		} else {
			message.error(update.message);
		}
    setShowUpdateModal(false);
    reloadData();
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
        }}
        onSubmit={handleSubmitCreate}
        confirmLoading={eTaskCreateLoading}
        dataSource={[]}
        mode={modalModes.CREATE}
      />
      <LeaderTaskProcedureModal
        open={showUpdateModal}
        onCancel={() => {
          setShowUpdateModal(false);
        }}
        onSubmit={handleSubmitUpdate}
        confirmLoading={eTaskUpdateLoading}
        dataSource={leaderTaskInfo.current}
        mode={modalModes.UPDATE}
      />
    </>
  );
};
