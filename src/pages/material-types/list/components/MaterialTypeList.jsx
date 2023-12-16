import { Edit, Forbid, More, PreviewOpen, Unlock } from "@icon-park/react";
import { Button, Dropdown, Space, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { BaseTable } from "../../../../components/BaseTable";
import { MaterialTypeModal } from "../../components/MaterialTypeModal";
import MaterialCategoryApi from "../../../../apis/material-category";
import { ConfirmDeleteModal } from "../../../../components/ConfirmDeleteModal";
import confirm from "antd/es/modal/confirm";
const MaterialTypeList = ({ canModify }) => {
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
      // {
      //   key: "VIEW_DETAIL",
      //   label: "Xem thông tin chi tiết",
      //   icon: <PreviewOpen/>,
      //   onClick: () => {
      //     materialTypeRef.current = record;
      //     // setShowUpdateMaterialTypeModal(true);
      //   },
      // },
      canModify.canUpdate && {
        key: "UPDATE_MATERIAL_TYPE",
        label: "Xem thông tin chi tiết",
        icon: <Edit />,
        onClick: () => {
          materialTypeRef.current = record;
          setShowUpdateMaterialTypeModal(true);
        },
      },
      canModify.canUpdate && {
        key: "SET_STATUS",
        danger: !isDeleted,
        label: !isDeleted ? "Xoá" : "Phục hồi",
        icon: !isDeleted ? <Forbid /> : <Unlock />,
        onClick: () => {
          confirm({
            title: "Xoá loại vật liệu",
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
      title: "Số lượng vật liệu",
      dataIndex: "quantityMaterial",
      key: "quantityMaterial",
      render: (_, record) => {
        return (
          <span
            onClick={() => {
              /*showModal(record) */
            }}
          >
            {record.quantityMaterial}
          </span>
        );
      },
      sorter: (a, b) => a.quantityMaterial.localeCompare(b.quantityMaterial),
    },
    // {
    //   title: "Tình trạng",
    //   dataIndex: "isDeleted",
    //   key: "isDeleted",
    //   width: "20%",
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
    //   //       label: "Khóa",
    //   //       value: true,
    //   //     },
    //   //   ],
    //   // },
    // },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      width: "10%",
      align: "center",
      render: (_, record) => {
        return (
          <Dropdown
            disabled={!canModify.canCreate || !canModify.canUpdate}
            menu={{ items: getActionItems(record) }}
          >
            <Button className="mx-auto flex-center" icon={<More />} />
          </Dropdown>
        );
      },
    },
  ];

  const handleSearch = (value) => {
    getData(value);
  };

  const deleteMaterialCategory = async (value) => {
    if (window.confirm("Bạn chắc chắn muốn xoá?")) {
      setLoading(true);
      const success = await MaterialCategoryApi.deleteMaterialCategory(value);
      if (success) {
        message.success("Xoá thành công");
      } else {
        message.error("Xoá thất bại");
      }
      getData();
      setLoading(false);
    }
  };

  return (
    <>
      <Space className="w-full flex justify-between mb-6">
        <div></div>
        <Button
          disabled={!canModify.canCreate || !canModify.canUpdate}
          type="primary"
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
        pagination={true}
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
