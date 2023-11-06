import { Edit, Forbid, More, Unlock } from "@icon-park/react";
import { Typography, Modal, Row, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { mockTasks } from "../../../../__mocks__/jama/tasks";
import { mockMaterials } from "../../../../__mocks__/jama/materials";
import { mockProcedures } from "../../../../__mocks__/jama/procedures";

import { ManagerTaskInfo } from "./components/ManagerTaskInfo";
import { ManagerTaskMaterial } from "./components/ManagerTaskMaterial";
import { ManagerTaskProcedure } from "./components/ManagerTaskProcedure";
import { ManagerTaskProcedureOverview } from "./components/ManagerTaskProcedureOverview";


export const ManagerTaskDetailsPage = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [taskInfo, setTaskInfo] = useState();
  const [materialInfo, setMaterialInfo] = useState();
  const [procedureInfo, setProcedureInfo] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const { Title } = Typography;

  const userRef = useRef();
  const rolesRef = useRef();

  const getData = async (taskId, handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }
    // const data = await UserApi.searchUsers(keyword);
    // data.sort((a, b) => {
    //   if (a.role === roles.ADMIN) {
    //     return -1; // a comes before b
    //   }
    //   if (b.role === roles.ADMIN) {
    //     return 1; // b comes before a
    //   }
    //   return 0; // no change in order
    // });
    // setTaskList(data);
    const dataTaskInfo = mockTasks.find(x => x.id === taskId);
    setTaskInfo(dataTaskInfo);

    setMaterialInfo(mockMaterials)

    setProcedureInfo(mockProcedures);

    setLoading(false);
  };

  const showModal = (item) => {
    setLoading(true);
    setPreviewUrl(item.imageUrl);
    setLoading(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setPreviewUrl("");
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (id) {
      getData(id, true);
    }
  }, [id]);

  const getActionItems = (record) => {
    const { isActive, id } = record;

    return [
      {
        key: "UPDATE_ROLE",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          userRef.current = record;
          setShowUpdateModal(true);
        },
      },
      {
        key: "SET_STATUS",
        label: isActive ? "Mở khóa" : "Khóa",
        danger: !isActive,
        icon: !isActive ? <Forbid /> : <Unlock />,
        onClick: () => { },
      },
    ];
  };

  const handleSearch = (value) => {
    getData(value);
  };

  return (
    <Space direction="vertical" className="w-full gap-6">
      <ManagerTaskInfo
        dataSource={taskInfo}
        loading={loading}
      />
      <ManagerTaskMaterial
        title="Danh sách vật liệu"
        dataSource={materialInfo}
      />
      <ManagerTaskProcedureOverview
        title="Tiến độ công việc"
        dataSource={procedureInfo}
      />
      <ManagerTaskProcedure
        title="Danh sách tiến độ"
        dataSource={procedureInfo}
      />
      <Modal centered open={isModalOpen} onOk={closeModal} onCancel={closeModal} footer={null}>
        <img src={previewUrl} className="w-full h-full object-cover mt-8" />
      </Modal>
    </Space>
  );
};