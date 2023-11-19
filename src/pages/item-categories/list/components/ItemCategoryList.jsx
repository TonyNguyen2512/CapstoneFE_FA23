import { Edit, Forbid, More, Unlock } from "@icon-park/react";
import { Button, Dropdown, Modal, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { BaseTable } from "../../../../components/BaseTable";
import { ItemCategoryModal } from "../../components/ItemCategoryModal";
import ItemCategoryApi from "../../../../apis/item-category";

const ItemCategoryList = () => {
  const [loading, setLoading] = useState(false);
  const [showItemCategoryModal, setShowItemCategoryModal] = useState(false);
  const [itemCategoryList, setItemCategoryList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const categoryRef = useRef();

  const getData = async (keyword) => {
    setLoading(true);
    const response = await ItemCategoryApi.getAllItem();
    setItemCategoryList(response.data);
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
          categoryRef.current = record;
          setShowItemCategoryModal(true);
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
      width: "30%",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Tên loại  sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return <span onClick={() => showModal(record)}>{record.name}</span>;
      },
      sorter: (a, b) => a?.name.localeCompare(b?.name),
    },
    {
      title: "Tình trạng",
      dataIndex: "itemCategoryId",
      key: "itemCategoryId",
      width: "15%",
      align: "center",
      render: (_, record) => {
        return (
          <span>{itemCategoryList?.find((e) => e.id === record.itemCategoryId)?.name || "-"}</span>
        );
      },
      sorter: (a, b) => a?.status.localeCompare(b?.status),
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
        <Button
          type="primay"
          className="btn-primary app-bg-primary font-semibold text-white"
          onClick={() => setShowItemCategoryModal(true)}
        >
          Thêm loại sản phẩm
        </Button>
      </Space>
      <BaseTable
        title="Danh sách loại sản phẩm"
        dataSource={itemCategoryList}
        columns={columns}
        loading={loading}
        pagination={{
          pageSize: 5,
        }}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm loại sản phẩm...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      <ItemCategoryModal
        data={categoryRef.current}
        open={showItemCategoryModal}
        onCancel={() => setShowItemCategoryModal(false)}
        onSuccess={() => getData()}
      />
      <Modal centered open={isModalOpen} onOk={closeModal} onCancel={closeModal} footer={null}>
        <img src={previewUrl} className="w-full h-full object-cover mt-8" />
      </Modal>
    </>
  );
};

export default ItemCategoryList;