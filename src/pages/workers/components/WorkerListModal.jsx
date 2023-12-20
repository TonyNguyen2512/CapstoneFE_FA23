import React, { useEffect, useRef, useState } from "react";
import BaseModal from "../../../components/BaseModal";
import { DatePicker, Dropdown, Form, Input, Select, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import dayjs from "dayjs";
import WorkerTasksApi from "../../../apis/worker-task";
import { PageSize } from "../../../constants/enum";
import { BaseTable } from "../../../components/BaseTable";
import { useNavigate, useParams } from "react-router-dom";
import { BasePageContent } from "../../../layouts/containers/BasePageContent";
import routes from "../../../constants/routes";

export const WorkerListModal = ({  }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [workerDetail, setWorkerDetail] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const getData = async (search, pageIndex, handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }
    const datas = await WorkerTasksApi.getByUserId(id, search, pageIndex, PageSize.WORKERS_LIST);
    console.log(datas.data);
    setWorkerDetail(datas.data);
    setLoading(false);
  };
  console.log("DATA", id);

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: "5%",
      // align: "center",
      render: (_, record, index) => {
        return <span>{index + 1 + (currentPage - 1) * PageSize.GROUP_LIST}</span>;
      },
    },
    {
      title: "Tên nhóm",
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
      title: "Tổ trưởng",
      dataIndex: "leaderName",
      key: "leaderName",
      render: (_, record) => {
        return (
          <span
            onClick={() => {
              /*showModal(record) */
            }}
          >
            {record.leaderName}
          </span>
        );
      },
      sorter: (a, b) => a.leaderName.localeCompare(b.leaderName),
    },
    {
      title: "Số công nhân",
      dataIndex: "amountWorker",
      key: "amountWorker",
      render: (_, record) => {
        return (
          <span
            onClick={() => {
              /*showModal(record) */
            }}
          >
            {record.amountWorker}
          </span>
        );
      },
      sorter: (a, b) => a.amountWorker - b.amountWorker,
    },
  ];

  const handleSearch = (value) => {
    getData(value, 1, true);
  };

  const onPageChange = (current) => {
    setCurrentPage(current);
    getData(null, current, false);
  };

  return (
    <BasePageContent
      onBack={() => navigate(`${routes.dashboard.root}/${routes.dashboard.workers}`)}
    >
      <BaseTable
        title={""}
        loading={loading}
        dataSource={workerDetail?.data}
        columns={columns}
        pagination={{
          onChange: onPageChange,
          pageSize: PageSize.WORKERS_LIST,
          total: workerDetail?.total,
        }}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm tài khoản...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
    </BasePageContent>
  );
};
