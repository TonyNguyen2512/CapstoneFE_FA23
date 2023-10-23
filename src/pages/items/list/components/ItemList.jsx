import { Edit, Forbid, More, Unlock } from "@icon-park/react";
import { Button, Dropdown, Modal, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { BaseTable } from "../../../../components/BaseTable";
import { UpdateItemModal } from "../../components/UpdateItemModal";
import { mockItemTypes, mockItems } from "../../../../__mocks__/jama/items";
import ItemApi from "../../../../apis/item";

const ItemList = () => {
  const [loading, setLoading] = useState(false);
  const [showUpdateItemModal, setShowUpdateItemModal] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const userRef = useRef();

  const getData = async (keyword) => {
    setLoading(true);
    const response = await ItemApi.getAllItem(keyword);
    console.log(response.data);
    setItemList(response.data);
    // setItemList(mockItems);
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

  const getActionItems = (record) => {
    const { isActive, id } = record;

    return [
      {
        key: "UPDATE_ROLE",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          userRef.current = record;
          setShowUpdateItemModal(true);
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
      align: "center",
      width: "10%",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return <span onClick={() => showModal(record)}>{record.name}</span>;
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      align: "center",
      sorter: (a, b) => a.color.localeCompare(b.color),
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "typeId",
      key: "typeId",
      width: "15%",
      align: "center",
      render: (_, record) => {
        return <span>{mockItemTypes.find((e) => e.id === record.typeId)?.name}</span>;
      },
      sorter: (a, b) => a.typeId.localeCompare(b.typeId),
    },
    {
      title: "Đơn giá",
      dataIndex: "amount",
      key: "amount",
      align: "center",
      width: "12%",
      render: (_, { amount }) => {
        return <span>{amount} VND</span>;
      },
      sorter: (a, b) => a.amount.localeCompare(b.amount),
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

  const handleSearch = (value) => {
    getData(value);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Space className="w-full flex justify-between mb-6">
        <div></div>
        <Button className="btn-primary app-bg-primary font-semibold text-white" type="primay">
          Thêm sản phẩm
        </Button>
      </Space>
      <BaseTable
        title="Danh sách sản phẩm"
        dataSource={itemList}
        columns={columns}
        loading={loading}
        pagination={false}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm sản phẩm...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      {/* <UpdateItemModal
        user={userRef.current}
        open={showUpdateItemModal}
        onCancel={() => setShowUpdateItemModal(false)}
        allRoles={rolesRef.current}
        onSuccess={() => getData()}
      /> */}
      <Modal centered open={isModalOpen} onOk={closeModal} onCancel={closeModal} footer={null}>
        <img src={previewUrl} className="w-full h-full object-cover mt-8" />
      </Modal>
    </>
  );
};

export default ItemList;
