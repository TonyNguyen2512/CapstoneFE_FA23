import { Edit, Forbid, More, Unlock } from "@icon-park/react";
import { Button, Dropdown, Modal, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { BaseTable } from "../../../../components/BaseTable";
import { ItemModal } from "../../components/ItemModal";
import { mockItemTypes, mockItems } from "../../../../__mocks__/jama/items";
import ItemApi from "../../../../apis/item";
import ItemCategoryApi from "../../../../apis/item-category";
import ProcedureApi from "../../../../apis/procedure";

const ItemList = () => {
  const [loading, setLoading] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [itemCategoryList, setItemCategoryList] = useState([]);
  const [listProcedures, setListProcedures] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const itemRef = useRef();

  const getData = async (keyword) => {
    setLoading(true);
    let response = await ItemCategoryApi.getAllItem();
    setItemCategoryList(response.data);
    response = await ItemApi.getAllItem(keyword);
    setItemList(response.data);
    setLoading(false);
    response = await ProcedureApi.getAllItem();
    setListProcedures(response.data);
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
          itemRef.current = record;
          setShowItemModal(true);
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
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    //   align: "center",
    //   width: "10%",
    //   sorter: (a, b) => a.id.localeCompare(b.id),
    // },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return <span onClick={() => showModal(record)}>{record.name}</span>;
      },
      sorter: (a, b) => a?.name.localeCompare(b?.name),
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      align: "center",
      sorter: (a, b) => a?.color.localeCompare(b?.color),
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "itemCategoryId",
      key: "itemCategoryId",
      width: "15%",
      align: "center",
      render: (_, record) => {
        return (
          <span>{itemCategoryList?.find((e) => e.id === record.itemCategoryId)?.name || "-"}</span>
        );
      },
      sorter: (a, b) => a?.itemCategoryId.localeCompare(b?.itemCategoryId),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      align: "center",
      width: "12%",
      render: (_, { price }) => {
        return <span>{price} VND</span>;
      },
      sorter: (a, b) => a?.price.localeCompare(b?.price),
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
          onClick={() => setShowItemModal(true)}
        >
          Thêm sản phẩm
        </Button>
      </Space>
      <BaseTable
        title="Danh sách sản phẩm"
        dataSource={itemList}
        columns={columns}
        loading={loading}
        pagination={{
          pageSize: 5,
        }}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm sản phẩm...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      <ItemModal
        data={itemRef.current}
        listCategories={itemCategoryList.map((i) => {
          return {
            label: i.name,
            value: i.id,
          };
        })}
        listProcedures={listProcedures.map((i) => {
          return {
            label: i.name,
            value: i.id,
          };
        })}
        open={showItemModal}
        onCancel={() => setShowItemModal(false)}
        onSuccess={() => getData()}
      />
      <Modal centered open={isModalOpen} onOk={closeModal} onCancel={closeModal} footer={null}>
        <img src={previewUrl} className="w-full h-full object-cover mt-8" />
      </Modal>
    </>
  );
};

export default ItemList;
