import { Delete, Edit, More } from "@icon-park/react";
import { Button, Dropdown, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { BaseTable } from "../../../../components/BaseTable";
import { ProcedureModal } from "../../components/ProcedureModal";
import ProcedureApi from "../../../../apis/procedure";
import StepApi from "../../../../apis/step";
import { AddStepToProcedureModal } from "../../components/AddStepToProcedureModal";

const ProcedureList = () => {
  const [loading, setLoading] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [procedureList, setProcedureList] = useState([]);
  const [stepList, setStepList] = useState([]);

  const categoryRef = useRef();

  const getData = async (keyword) => {
    setLoading(true);
    let response = await StepApi.getAllItem();
    setStepList(response.data);
    response = await ProcedureApi.getAllItem(keyword);
    setProcedureList(response.data);
    setLoading(false);
  };

  const getActionItems = (record) => {
    return [
      {
        key: "UPDATE_ROLE",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          categoryRef.current = record;
          setShowStepModal(true);
        },
      },
      {
        key: "SET_STATUS",
        label: "Xoá",
        danger: true,
        icon: <Delete />,
        onClick: () => {},
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
      title: "Tên quy trình",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a?.name.localeCompare(b?.name),
    },
    {
      title: "Danh sách bước",
      dataIndex: "listStep",
      key: "listStep",
      width: "50%",
      render: (_, { listStep }) =>
        listStep?.map((e, i) => (
          <p>
            {i + 1}. {stepList?.find((step) => step.id === e.stepId)?.name}
          </p>
        )),
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

export default ProcedureList;
