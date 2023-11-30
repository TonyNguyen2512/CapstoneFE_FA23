import { Edit, Lightning, Forbid, More, Unlock } from "@icon-park/react";
import { Button, Dropdown, Modal, Space } from "antd";
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
import { ProcedureModal } from "../../../procedures/components/ProcedureModal";

const ItemList = () => {
  const [loading, setLoading] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showItemDuplicateModal, setShowItemDuplicateModal] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [itemCategoryList, setItemCategoryList] = useState([]);
  const [listProcedures, setListProcedures] = useState([]);
  const [listMaterials, setListMaterials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [stepList, setStepList] = useState([]);
  const [procedureList, setProcedureList] = useState([]);
  const [showStepModal, setShowStepModal] = useState(false);

  const categoryRef = useRef();
  const itemRef = useRef();

  const getData = async (search, pageIndex, handleLoading, keyword) => {
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
    response = await StepApi.getAllItem();
    setStepList(response.data);
    response = await ProcedureApi.getAllItem(keyword);
    setProcedureList(response.data);

    console.log(itemList);
    console.log(listProcedures);
  };

  const [expandedRows, setExpandedRows] = useState([]);
  const handleExpand = (record) => {
    const isRowExpanded = expandedRows.includes(record.key);

    // Toggle the expanded state for the clicked row
    const newExpandedRows = isRowExpanded
      ? expandedRows.filter((key) => key !== record.key)
      : [...expandedRows, record.key];

    setExpandedRows(newExpandedRows);
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
        key: "DUPLICATE_ITEM",
        label: "Nhân bản sản phẩm",
        icon: <Lightning />,
        onClick: () => {
          itemRef.current = record;
          setShowItemDuplicateModal(true);
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

  const expandedRowRender = () => {
    const columns = [
      {
        title: "Tên quy trình",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a?.name.localeCompare(b?.name),
      },
      {
        title: "Danh sách bước",
        dataIndex: "listStep",
        key: "listStep",
        render: (_, { listStep }) =>
          listStep?.map((e) => (
            <p>
              {++e.priority}. {stepList?.find((step) => step.id === e.stepId)?.name}
            </p>
          )),
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
    return (
      <>
        <Space className="w-full flex justify-between mb-6">
          <div></div>
          <Button
            type="primay"
            className="btn-primary app-bg-primary font-semibold text-white"
            onClick={() => setShowStepModal(true)}
          >
            Thêm quy trình
          </Button>
        </Space>
        <BaseTable
          title="Danh sách quy trình"
          dataSource={procedureList}
          columns={columns}
          loading={loading}
          pagination={{
            pageSize: 5,
          }}
          searchOptions={{
            visible: true,
            placeholder: "Tìm kiếm quy trình...",
            onSearch: handleSearch,
            width: 300,
          }}
        />
        {/* <AddStepToProcedureModal
          open={true}
          // onSubmit={handleCreateGroup}
          // confirmLoading={groupCreating}
          // onCancel={false}
          // group={id}
          // workers={workerNotInGroupList}
        /> */}
        <ProcedureModal
          data={categoryRef.current}
          options={stepList.map((e) => {
            return {
              label: e.name,
              value: e.id,
            };
          })}
          open={showStepModal}
          onCancel={() => setShowStepModal(false)}
          onSuccess={() => getData()}
        />
      </>
    );
  };

  const columns = [
    {
      title: "Expand",
      key: "expand",
      width: "5%",
      render: (_, record) => (
        <Button type="link" onClick={() => handleExpand(record)}>
          {expandedRows.includes(record.key) ? "Collapse" : "Expand"}
        </Button>
      ),
    },
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: "5%",
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
    // {
    //   title: "Màu sắc",
    //   dataIndex: "color",
    //   key: "color",
    //   align: "center",
    //   sorter: (a, b) => a?.color.localeCompare(b?.color),
    // },
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
          <Dropdown menu={{ items: getActionItems(record) }}>
            <Button className="mx-auto flex-center" icon={<More />} />
          </Dropdown>
        );
      },
    },
  ];

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
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ["0"],
        }}
        dataSource={itemList?.data}
        columns={columns}
        loading={loading}
        pagination={{
          onChange: onPageChange,
          pageSize: PageSize.ITEM_LIST,
          total: itemList?.total,
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
        onSuccess={() => getData()}
      />
      <Modal centered open={isModalOpen} onOk={closeModal} onCancel={closeModal} footer={null}>
        <img src={previewUrl} className="w-full h-full object-cover mt-8" />
      </Modal>
    </>
  );
};

export default ItemList;
