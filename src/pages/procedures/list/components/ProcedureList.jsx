import { Delete, Edit, More } from "@icon-park/react";
import { Button, Dropdown, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { BaseTable } from "../../../../components/BaseTable";
import { ProcedureModal } from "../../components/ProcedureModal";
import ProcedureApi from "../../../../apis/procedure";
import StepApi from "../../../../apis/step";
import { PageSize } from "../../../../constants/enum";

const ProcedureList = () => {
  const [loading, setLoading] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [procedureList, setProcedureList] = useState([]);
  const [stepList, setStepList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState([]);

  const prodRef = useRef();

  const getData = async (search, pageIndex, handleLoading) => {
    handleLoading && setLoading(true);
    let response = await StepApi.getAllWithoutPaging();
    setStepList(response);
    response = await ProcedureApi.getAll(search, pageIndex, PageSize.PROCEDURE_LIST);
    setProcedureList(response.data);
    response = await ProcedureApi.getAllTotal(search, pageIndex, PageSize.STEP_LIST);
    setTotal(response.data || []);
    handleLoading && setLoading(false);
  };

  const getActionItems = (record) => {
    return [
      {
        key: "UPDATE_ROLE",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          prodRef.current = record;
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
        return <span>{index + 1 + (currentPage - 1) * PageSize.PROCEDURE_LIST}</span>;
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
            {i + 1}.{" "}
            {e.stepName ? e.stepName : stepList?.find((step) => step.id === e?.stepId)?.name}
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
    getData(value, 1, true);
  };

  useEffect(() => {
    getData(null, 1, true);
  }, []);

  const onPageChange = (current) => {
    setCurrentPage(current);
    getData(null, current, false);
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
          onChange: onPageChange,
          pageSize: PageSize.PROCEDURE_LIST,
          total: total,
        }}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm quy trình...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      <ProcedureModal
        data={prodRef.current}
        options={stepList?.map((e) => {
          return {
            label: e.name,
            value: e.id,
          };
        })}
        open={showStepModal}
        onCancel={() => {
          setShowStepModal(false);
          prodRef.current = null;
        }}
        onSuccess={() => getData()}
      />
    </>
  );
};

export default ProcedureList;
