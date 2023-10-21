import { Edit, Forbid, More, Unlock } from "@icon-park/react";
import { Button, Dropdown, Space, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { BaseTable } from "../../../../components/BaseTable";
import { MaterialTypeModal } from "../../components/MaterialTypeModal";
import MaterialCategoryApi from "../../../../apis/material-category";
import { ConfirmDeleteModal } from "../../../../components/ConfirmDeleteModal";
import confirm from "antd/es/modal/confirm";
const MaterialTypeList = () => {
  const [loading, setLoading] = useState(false);
  const [showUpdateMaterialTypeModal, setShowUpdateMaterialTypeModal] = useState(false);
  const [materialTypeList, setMaterialTypeList] = useState([]);

  const materialTypeRef = useRef();

  const getData = async (keyword) => {
    setLoading(true);
    const response = await MaterialCategoryApi.getAllMaterialCategory(keyword);

    setMaterialTypeList(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const getActionItems = (record) => {
    const { isDeleted } = record;
    return [
      {
        key: "UPDATE_ROLE",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          materialTypeRef.current = record;
          setShowUpdateMaterialTypeModal(true);
        },
      },
      {
        key: "SET_STATUS",
        danger: !isDeleted,
        label: !isDeleted ? "Xoá" : "Phục hồi",
        icon: !isDeleted ? <Forbid /> : <Unlock />,
        onClick: () => {
          confirm({
            title: "Xoá Loại vật liệu",
            content: `Chắc chắn xoá "${record.name}"?`,
            type: "confirm",
            cancelText: "Cancel",
            onOk: () => deleteItem(record.id),
            onCancel: () => {},
            closable: true,
          });
        },
      },
    ];
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "30%",
      align: "center",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Tên loại vật liệu",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return (
          <span
            onClick={() => {
              /*showModal(record) */
            }}
          >
            {record.name}
          </span>
        );
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Tình trạng",
      dataIndex: "isDeleted",
      key: "isDeleted",
      width: "20%",
      align: "center",
      render: (_, { isDeleted }) => {
        return (
          <span style={{ color: isDeleted ? "#FF0000" : "#29CB00" }}>
            {isDeleted ? "Không hoạt động" : "Đang hoạt động"}
          </span>
        );
      },
      sorter: (a, b) => a.isDeleted - b.isDeleted,
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

  const deleteItem = async (value) => {
    setLoading(true);
    const success = await MaterialCategoryApi.deleteMaterialCategory(value);
    if (success) {
      message.success("Xoá thành công");
    } else {
      message.error("Xoá thất bại");
    }
    getData();
    setLoading(false);
  };

  return (
    <>
      <Space className="w-full flex justify-between mb-6">
        <div></div>
        <Button
          type="primay"
          className="btn-primary app-bg-primary font-semibold text-white"
          onClick={() => setShowUpdateMaterialTypeModal(true)}
        >
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
      <MaterialTypeModal
        data={materialTypeRef.current}
        open={showUpdateMaterialTypeModal}
        onCancel={() => {
          setShowUpdateMaterialTypeModal(false);
          materialTypeRef.current = null;
        }}
        onSuccess={() => getData()}
      />
    </>
  );
};

export default MaterialTypeList;
