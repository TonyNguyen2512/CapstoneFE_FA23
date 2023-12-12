import { Edit, Lightning, Forbid, More, Unlock } from "@icon-park/react";
import { Button, Dropdown, Modal, Space, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { BaseTable } from "../../../../components/BaseTable";
import { ItemModal } from "../../components/ItemModal";
import { mockItemTypes, mockItems } from "../../../../__mocks__/jama/items";
import { ItemDuplicateModal } from "../../components/ItemDuplicate";
import ItemApi from "../../../../apis/item";
import ItemCategoryApi from "../../../../apis/item-category";
import ProcedureApi from "../../../../apis/procedure";
import { PageSize } from "../../../../constants/enum";
import MaterialApi from "../../../../apis/material";
import StepApi from "../../../../apis/step";
import { useNavigate, useParams } from "react-router-dom";
import routes from "../../../../constants/routes";

const ItemList = ({ canModify }) => {
  const [loading, setLoading] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showItemDuplicateModal, setShowItemDuplicateModal] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [itemCategoryList, setItemCategoryList] = useState([]);
  const [listProcedures, setListProcedures] = useState([]);
  const [stepList, setStepList] = useState([]);
  const [listMaterials, setListMaterials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const itemRef = useRef();

  const getData = async (search, pageIndex, handleLoading = true) => {
    if (handleLoading) {
      setLoading(true);
    }
    let response = await ItemApi.getAllItem(search, pageIndex, PageSize.ITEM_LIST);
    setItemList(response);
    response = await ItemCategoryApi.getAllItem();
    setItemCategoryList(response.data);
    setLoading(false);
    response = await ProcedureApi.getAllItem();
    setListProcedures(response.data);
    response = await MaterialApi.getAllMaterial();
    setListMaterials(response.data);
    response = await StepApi.getAll();
    setStepList(response.data);
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
      canModify.canUpdate && {
        key: "UPDATE_ITEM",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          itemRef.current = record;
          setShowItemModal(true);
        },
      },
      canModify.canCreate && {
        key: "DUPLICATE_ITEM",
        label: "Sao chép sản phẩm",
        icon: <Lightning />,
        onClick: () => {
          itemRef.current = record;
          setShowItemDuplicateModal(true);
        },
      },
      canModify.canUpdate && {
        key: "SET_STATUS",
        label: "Xoá",
        danger: !isActive,
        icon: !isActive ? <Forbid /> : <Unlock />,
        onClick: ({ id }) => {
          const success = ItemApi.deleteItem(id);
          success && getData();
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
        return <span>{index + 1 + (currentPage - 1) * PageSize.ITEM_LIST}</span>;
      },
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "code",
      key: "code",
      render: (_, record) => {
        return <span onClick={() => showModal(record)}>{record.code}</span>;
      },
      sorter: (a, b) => a?.code.localeCompare(b?.code),
    },
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
      title: "Loại sản phẩm",
      dataIndex: "itemCategoryName",
      key: "itemCategoryName",
      width: "35%",
      align: "center",
      render: (_, record) => {
        return <span>{record?.itemCategoryName || "-"}</span>;
      },
      sorter: (a, b) => a?.itemCategoryName.localeCompare(b?.itemCategoryName),
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
      sorter: (a, b) => a?.price - b?.price,
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, record) => {
        return (
          <Dropdown
            menu={{ items: getActionItems(record) }}
            disabled={!canModify.canCreate || !canModify.canUpdate}
          >
            <Button className="mx-auto flex-center" icon={<More />} />
          </Dropdown>
        );
      },
    },
  ];

  const expandedRowRender = (row) => {
    // columns for procedure
    const columns = [
      {
        title: "Quy trình",
        width: "30%",
        dataIndex: "procedureId",
        key: "procedureId",
        render: (_, { procedure }) => <span>{procedure?.name}</span>,
      },
      {
        title: "Độ ưu tiên",
        width: "12%",
        align: "center",
        dataIndex: "priority",
        key: "priority",
      },
      {
        title: "Danh sách các bước",
        dataIndex: "listStep",
        key: "listStep",
        render: (_, { procedure }) =>
          procedure?.listStep?.map((e, i) => (
            <p className="my-1">
              {i + 1}. {stepList?.find((step) => step.id === e.stepId)?.name}
            </p>
          )),
      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={row.listProcedure?.map((e) => {
          return {
            ...e,
            key: e.procedureId,
            procedure: listProcedures?.find((p) => p.id === e.procedureId) || null,
          };
        })}
        size="small"
        pagination={false}
        style={{ marginRight: "4%" }}
      />
    );
  };

  const handleSearch = (value) => {
    getData(value, 1, true);
  };

  const onPageChange = (current) => {
    setCurrentPage(current);
    getData(null, current, false);
  };

  useEffect(() => {
    getData(null, 1, true);
  }, []);

  console.log(itemList);

  return (
    <>
      <Space direction="vertical" className="w-full gap-6">
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            style={{ marginLeft: "10px", marginBottom: "10px" }}
            type="primary"
            className="btn-primary app-bg-primary font-semibold text-white"
            onClick={() => navigate(`${routes.dashboard.root}/${routes.dashboard.itemsLog}`)}
          >
            Lịch sử chỉnh sửa
          </Button>
          <Button
            style={{ marginLeft: "10px", marginBottom: "10px" }}
            disabled={!canModify.canCreate || !canModify.canUpdate}
            type="primay"
            className="btn-primary app-bg-primary font-semibold text-white"
            onClick={() => setShowItemModal(true)}
          >
            Thêm sản phẩm
          </Button>
        </div>
      </Space>
      <BaseTable
        title="Danh sách sản phẩm"
        dataSource={itemList?.data?.map((e) => {
          return { ...e, key: e.id };
        })}
        columns={columns}
        loading={loading}
        pagination={{
          onChange: onPageChange,
          pageSize: PageSize.ITEM_LIST,
          total: itemList?.total,
        }}
        expandable={{
          expandedRowRender,
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
        listItemNames={itemList.data?.map((i) => i.name)}
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
        listMaterials={listMaterials.map((i) => {
          return {
            label: i.name,
            value: i.id,
          };
        })}
        open={showItemModal}
        onCancel={() => setShowItemModal(false)}
        onSuccess={() => getData()}
      />
      <ItemDuplicateModal
        data={itemRef.current}
        open={showItemDuplicateModal}
        onCancel={() => setShowItemDuplicateModal(false)}
        id={id}
        onSuccess={() => getData()}
      />
      <Modal centered open={isModalOpen} onOk={closeModal} onCancel={closeModal} footer={null}>
        <img src={previewUrl} className="w-full h-full object-cover mt-8" />
      </Modal>
    </>
  );
};

export default ItemList;
