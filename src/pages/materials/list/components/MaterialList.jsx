import { Edit, Forbid, More, PreviewOpen, Unlock } from "@icon-park/react";
import { Button, Dropdown, Modal, Space, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { BaseTable } from "../../../../components/BaseTable";
import MaterialApi from "../../../../apis/material";
import dayjs from "dayjs";
import confirm from "antd/es/modal/confirm";
import { MaterialModal } from "../../components/MaterialModal";

const MaterialList = () => {
  const [loading, setLoading] = useState(false);
  const [showUpdateMaterialModal, setShowUpdateMaterialModal] = useState(false);
  const [materialList, setMaterialList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const materialRef = useRef();
  const userRef = useRef();

  const getData = async (keyword) => {
    setLoading(true);
    const response = await MaterialApi.getAllMaterial(keyword);

    setMaterialList(response.data);
    // setMaterialList(mockMaterials);
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

  const deleteMaterialCategory = async (value) => {
    setLoading(true);
    const success = await MaterialApi.deleteMaterial(value);
    if (success) {
      message.success("Xoá thành công");
    } else {
      message.error("Xoá thất bại");
    }
    getData();
    setLoading(false);
  };

  const getActionItems = (record) => {
    const { isDeleted, id } = record;

    return [
      {
        key: "VIEW_DETAIL",
        label: "Xem thông tin chi tiết",
        icon: <PreviewOpen />,
        onClick: () => {
          userRef.current = record;
          // setShowUpdateMaterialModal(true);
        },
      },
      {
        key: "UPDATE_ROLE",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          userRef.current = record;
          setShowUpdateMaterialModal(true);
        },
      },
      {
        key: "SET_STATUS",
        label: isDeleted ? "Mở khóa" : "Khóa",
        danger: !isDeleted,
        icon: !isDeleted ? <Forbid /> : <Unlock />,
        onClick: () => {
          confirm({
            title: "Xoá vật liệu",
            content: `Chắc chắn xoá "${record.name}"?`,
            type: "confirm",

            cancelText: "Hủy",
            onOk: () => deleteMaterialCategory(record.id),
            onCancel: () => {},
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
      title: "Tên vật liệu",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return <span onClick={() => showModal(record)}>{record.name}</span>;
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Mã vật liệu (SKU)",
      dataIndex: "sku",
      key: "sku",
      // align: "center",
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      key: "amount",
      // align: "center",
      sorter: (a, b) => a.quantity.localeCompare(b.quantity),
    },
    // {
    //   title: "Đơn giá",
    //   dataIndex: "price",
    //   key: "price",
    //   // align: "center",
    //   render: (_, { price }) => {
    //     return <span>{price.toLocaleString()} VNĐ</span>;
    //   },
    //   sorter: (a, b) => a.price.localeCompare(b.price),
    // },
    // {
    //   title: "Thành tiền",
    //   dataIndex: "totalPrice",
    //   key: "totalPrice",
    //   // align: "center",
    //   render: (_, { totalPrice }) => {
    //     return <span>{totalPrice.toLocaleString()} VNĐ</span>;
    //   },
    //   sorter: (a, b) => a.totalPrice.localeCompare(b.totalPrice),
    // },
    {
      title: "Ngày nhập",
      dataIndex: "importDate",
      key: "importDate",
      // align: "center",
      render: (_, record) => {
        const formattedDate = dayjs(record.importDate).format("DD/MM/YYYY");
        return <span>{formattedDate}</span>;
      },
      // sorter: (a, b) => a.addedDate.localeCompare(b.addedDate),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      sorter: (a, b) => a.addedLocation.localeCompare(b.addedLocation),
    },
    // {
    //   title: "Tình trạng",
    //   dataIndex: "isDeleted",
    //   key: "isDeleted",
    //   width: "30%",
    //   align: "center",
    //   render: (_, { isDeleted }) => {
    //     return (
    //       <span style={{ color: isDeleted ? "#FF0000" : "#29CB00" }}>
    //         {isDeleted ? "Không hoạt động" : "Đang hoạt động"}
    //       </span>
    //     );
    //   },
    //   sorter: (a, b) => a.isDeleted - b.isDeleted,
    //   // filter: {
    //   //   placeholder: "Chọn trạng thái",
    //   //   label: "Trạng thái",
    //   //   filterOptions: [
    //   //     {
    //   //       label: "Đang hoạt động",
    //   //       value: false,
    //   //     },
    //   //     {
    //   //       label: "Không hoạt động",
    //   //       value: true,
    //   //     },
    //   //   ],
    //   // },
    // },
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
          onClick={() => setShowUpdateMaterialModal(true)}
        >
          Thêm vật liệu
        </Button>
      </Space>
      <BaseTable
        title="Danh sách vật liệu"
        dataSource={materialList}
        columns={columns}
        loading={loading}
        pagination={false}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm vật liệu...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      <MaterialModal
        data={materialRef.current}
        open={showUpdateMaterialModal}
        onCancel={() => {
          setShowUpdateMaterialModal(false);
          materialRef.current = null;
        }}
        onSuccess={() => getData()}
      />
      <Modal centered open={isModalOpen} onOk={closeModal} onCancel={closeModal} footer={null}>
        <img src={previewUrl} className="w-full h-full object-cover mt-8" />
      </Modal>
    </>
  );
};

export default MaterialList;
