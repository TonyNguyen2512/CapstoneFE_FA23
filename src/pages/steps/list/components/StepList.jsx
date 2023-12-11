import { Delete, Edit, Forbid, More, Unlock } from "@icon-park/react";
import { Button, Dropdown, Modal, Space, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { BaseTable } from "../../../../components/BaseTable";
import { StepModal } from "../../components/StepModal";
import StepApi from "../../../../apis/step";

const StepList = () => {
  const [loading, setLoading] = useState(false);
  const [showItemCategoryModal, setShowItemCategoryModal] = useState(false);
  const [stepList, setStepList] = useState([]);

  const stepRef = useRef();

  const getData = async (keyword) => {
    setLoading(true);
    const response = await StepApi.getAllItem();
    setStepList(response.data);
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
        return <span>{index + 1}</span>;
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
      width: "120px",
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
  const handleRemove = async (id) => {
    const success = await StepApi.deleteItem(id);
    if (success) {
      message.success(`Xoá thành công`);
    } else {
      message.error(`Xoá thất bại`);
    }
    getData();
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
          Thêm bước
        </Button>
      </Space>
      <BaseTable
        title="Danh sách bước"
        dataSource={stepList}
        columns={columns}
        loading={loading}
        pagination={{
          pageSize: 5,
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
        onCancel={() => setShowItemCategoryModal(false)}
        onSuccess={() => getData()}
      />
    </>
  );
};

export default StepList;
