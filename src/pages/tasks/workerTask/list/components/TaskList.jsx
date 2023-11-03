import { Edit, Forbid, More, Unlock } from "@icon-park/react";
import { Button, Card, Col, Dropdown, Modal, Row, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { mockTasks } from "../../../../../__mocks__/task";
import { formatDate } from "../../../../../utils";
import { enumTaskStatuses } from "../../../../../__mocks__/jama/tasks";
import { mockMaterials } from "../../../../../__mocks__/jama/materials";

const WorkerTaskList = () => {
  const [loading, setLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const userRef = useRef();
  const rolesRef = useRef();

  const getData = async (keyword) => {
    setLoading(true);
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
    setTaskList(mockMaterials);
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
    getData();
  }, []);

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
        onClick: () => {},
      },
    ];
  };

  const getTaskStatus = (status) => {
    return enumTaskStatuses[status]?.name || "Không Xác Định";
  };

  const handleSearch = (value) => {
    getData(value);
  };

  return (
    <>
      <Space direction="vertical" className="w-full gap-6">
        <Row gutter={[32, 16]}>
          {mockTasks.map((e) => (
            <Col span={12}>
              <Card style={{ borderRadius: "1rem", gap: "2rem" }} loading={loading}>
                <Row>Tên đơn hàng: {e?.taskName}</Row>
                <Row>
                  <Col span={12}>Ngày bắt đầu: {formatDate(e?.timeStart, "DD/MM/YYYY")}</Col>
                  <Col span={12}>Ngày kết thúc: {formatDate(e?.timeEnd, " DD/MM/YYYY")}</Col>
                </Row>
                <Row>Tình trạng: {getTaskStatus(e?.status)}</Row>
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
      {/* <UpdateMaterialModal
        user={userRef.current}
        open={showUpdateMaterialModal}
        onCancel={() => setShowUpdateMaterialModal(false)}
        allRoles={rolesRef.current}
        onSuccess={() => getData()}
      /> */}
      <Modal centered open={isModalOpen} onOk={closeModal} onCancel={closeModal} footer={null}>
        <img src={previewUrl} className="w-full h-full object-cover mt-8" />
      </Modal>
    </>
  );
};

export default WorkerTaskList;
