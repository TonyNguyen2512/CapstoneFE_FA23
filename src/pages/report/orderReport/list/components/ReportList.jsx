import { Button } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import moment from "moment";
import OrderReportApi from "../../../../../apis/order-report";
import { BaseTable } from "../../../../../components/BaseTable";
import { ReportMap } from "../../../../../constants/enum";
import { UserContext } from "../../../../../providers/user";

export const ReportList = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const getReports = async (search) => {
    setLoading(true);
    const list = await OrderReportApi.getAll(pageIndex, pageSize, search);
    setReports(list);
    setLoading(false);
  };

  useEffect(() => {
    if (user?.id) {
      getReports();
    }
  }, [user?.id]);

  const columns = [
    {
      key: "title",
      title: "Tên báo cáo",
      render: (_, record) => {
        return record?.title ?? "";
      },
    },
    {
      key: "ordername",
      title: "Tên đơn",
      render: (_, record) => {
        return record?.order?.name ?? "";
      },
    },
    {
      key: "content",
      title: "Nội dung",
      render: (_, record) => {
        return record?.content ?? "";
      },
    },
    {
      key: "createdDate",
      title: "Ngày tạo",
      render: (_, record) => {
        return record?.createdDate ? moment(record?.createdDate).format("DD/MM/YYYY") : "";
      },
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (_, record) => {
        let data = ReportMap[record?.status];
        return <span className={data?.color}>{data ? data.label : ""}</span>;
      },
    },
    {
      key: "action",
      title: "Thao tác",
      render: (_, record) => {
        return (
          <></>
          // <Button
          //   type="primary"
          //   onClick={() => {
          //     navigate(record?.id);
          //   }}
          // >
          //   Xem báo cáo
          // </Button>
        );
      },
    },
  ];

  return (
    <>
      <BaseTable
        title="Danh sách báo cáo"
        dataSource={reports?.data || []}
        columns={columns}
        loading={loading}
        pagination={true}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm công việc...",
          onSearch: (val) => getReports(val),
          width: 300,
        }}
      />
      {/* <Table
        dataSource={reports.data}
        columns={columns}
        locale={{
          emptyText: <Empty description={<Text disabled>Không có task</Text>} />,
        }}
      /> */}
    </>
  );
};
