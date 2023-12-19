import { Delete, Edit, Forbid, More, Unlock } from "@icon-park/react";
import { Button, Dropdown, Modal, Space, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { BaseTable } from "../../../../components/BaseTable";
import { StepModal } from "../../components/StepModal";
import StepApi from "../../../../apis/step";
import { PageSize } from "../../../../constants/enum";

const StepList = () => {
  const [loading, setLoading] = useState(false);
  const [showItemCategoryModal, setShowItemCategoryModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [stepList, setStepList] = useState([]);
  const [total, setTotal] = useState([]);

  const searchRef = useRef();
  const stepRef = useRef();

  const getData = async (search, pageIndex, handleLoading = true) => {
    if (handleLoading) {
      setLoading(true);
    }
    let response = await StepApi.getAll(search, pageIndex, PageSize.STEP_LIST);
    setStepList(response.data);
    console.log(response.data);
    response = await StepApi.getAllTotal(search, pageIndex, PageSize.STEP_LIST);
    setTotal(response.data || []);
    setLoading(false);
  };

  const getActionItems = (record) => {
    return [
      {
        key: "UPDATE_ROLE",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          stepRef.current = record;
          setShowItemCategoryModal(true);
        },
      },
      {
        key: "SET_STATUS",
        label: "Xoá",
        danger: true,
        icon: <Delete />,
        onClick: () => handleRemove(record.id),
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
        return <span>{index + 1 + (currentPage - 1) * PageSize.STEP_LIST}</span>;
      },
    },
    {
      title: "Tên bước",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a?.name.localeCompare(b?.name),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      align: "center",
      width: "10%",
      render: (_, record) => {
        return (
          <Dropdown menu={{ items: getActionItems(record) }}>
            <Button className="mx-auto flex-center" icon={<More />} />
          </Dropdown>
        );
      },
    },
  ];

  const handleRemove = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xoá?")) {
      setLoading(true);
      const success = await StepApi.deleteItem(id);
      if (success) {
        message.success(`Xoá thành công`);
      } else {
        message.error(`Xoá thất bại`);
      }
      await getData(searchRef.current, currentPage, currentPage === 1);
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    searchRef.current = value;
  };

  const onPageChange = (current) => {
    setCurrentPage(current);
  };

  useEffect(() => {
    getData(searchRef.current, currentPage, currentPage === 1);
  }, [currentPage, searchRef.current]);

  return (
    <>
      <Space className="w-full flex justify-between mb-6">
        <div></div>
        <Button
          type="primay"
          className="btn-primary app-bg-primary font-semibold text-white"
          onClick={() => setShowItemCategoryModal(true)}
        >
          Thêm bước
        </Button>
      </Space>
      <BaseTable
        title="Danh sách bước"
        dataSource={stepList}
        columns={columns}
        loading={loading}
        pagination={{
          onChange: onPageChange,
          pageSize: PageSize.STEP_LIST,
          total: total,
        }}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm bước...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      <StepModal
        data={stepRef.current}
        open={showItemCategoryModal}
        onCancel={() => {
          setShowItemCategoryModal(false);
          stepRef.current = null;
        }}
        onSuccess={() => getData(searchRef.current, currentPage, true)}
      />
    </>
  );
};

export default StepList;
