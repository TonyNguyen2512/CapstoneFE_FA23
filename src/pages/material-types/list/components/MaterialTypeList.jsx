import { Edit, Forbid, More, Unlock } from "@icon-park/react";
import { Button, Dropdown, Modal, Space, Tag, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import RoleApi from "../../../../apis/role";
import UserApi from "../../../../apis/user";
import { BaseTable } from "../../../../components/BaseTable";
import { roles } from "../../../../constants/app";
import { getRoleName } from "../../../../utils";
import { UpdateMaterialTypeModal } from "../../components/UpdateMaterialTypeModal";
import { mockMaterialTypes } from "../../../../__mocks__/jama/materials";

const MaterialTypeList = () => {
  const [loading, setLoading] = useState(false);
  const [showUpdateMaterialTypeModal, setShowUpdateMaterialTypeModal] = useState(false);
  const [materialTypeList, setMaterialTypeList] = useState([]);
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
    // setMaterialTypeList(data);
    setMaterialTypeList(mockMaterialTypes);
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
    const { isActive } = record;

    return [
      {
        key: "UPDATE_ROLE",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          userRef.current = record;
          setShowUpdateMaterialTypeModal(true);
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "20%",
      align: "center",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Tên loại vật liệu",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return <span onClick={() => showModal(record)}>{record.name}</span>;
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Tình trạng",
      dataIndex: "isActive",
      key: "isActive",
      width: "30%",
      align: "center",
      render: (_, { isActive }) => {
        return (
          <span style={{ color: isActive ? "#29CB00" : "#FF0000" }}>
            {isActive ? "Đang hoạt động" : "Không hoạt động"}
          </span>
        );
      },
      sorter: (a, b) => a.isActive - b.isActive,
      // filter: {
      //   placeholder: "Chọn trạng thái",
      //   label: "Trạng thái",
      //   filterOptions: [
      //     {
      //       label: "Đang hoạt động",
      //       value: false,
      //     },
      //     {
      //       label: "Khóa",
      //       value: true,
      //     },
      //   ],
      // },
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
    getData(value);
  };

  return (
    <>
      <Space className="w-full flex justify-between mb-6">
        <div></div>
        <Button className="btn-primary app-bg-primary font-semibold text-white" type="primay">
          Thêm loại vật liệu
        </Button>
      </Space>
      <BaseTable
        title="Danh sách loại vật liệu"
        dataSource={materialTypeList}
        columns={columns}
        loading={loading}
        pagination={false}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm loại vật liệu...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      {/* <UpdateMaterialTypeModal
        user={userRef.current}
        open={showUpdateMaterialTypeModal}
        onCancel={() => setShowUpdateMaterialTypeModal(false)}
        allRoles={rolesRef.current}
        onSuccess={() => getData()}
      /> */}
      <Modal centered open={isModalOpen} onOk={closeModal} onCancel={closeModal} footer={null}>
        <img src={previewUrl} className="w-full h-full object-cover mt-8" />
      </Modal>
    </>
  );
};

export default MaterialTypeList;
