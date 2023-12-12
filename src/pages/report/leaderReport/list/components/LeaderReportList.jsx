import { Button, Dropdown, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import moment from "moment";
import OrderReportApi from "../../../../../apis/order-report";
import { BaseTable } from "../../../../../components/BaseTable";
import { PageSize, ReportMap, orderReportMap } from "../../../../../constants/enum";
import { UserContext } from "../../../../../providers/user";
import { Edit, More, ViewList } from "@icon-park/react";
import { formatDate } from "../../../../../utils";
import OrderReportUpdateModal from "../../../orderReport/components/OrderReportUpdateModal";
import ReportApi from "../../../../../apis/task-report";

export const LeaderReportList = () => {
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectingOrderReport, setSelectingOrderReport] = useState();

  const getReports = async (search, pageIndex, handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }
    // const data = await OrderReportApi.getAll(pageIndex, pageSize, search);
    const data = await ReportApi.getReportByLeaderId(search, pageIndex, PageSize.LEADER_REPORT_LIST);
    setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    getReports(null, 1, true);
  }, []);

  const handleSearch = (value) => {
    getReports(value, 1, true);
  };

  const onPageChange = (current) => {
    setCurrentPage(current);
    getReports(null, current, false);
  };


  const getActionOrderReports = (record) => {
    return [
      {
        key: "VIEW_DETAIL",
        label: "Xem thông tin chi tiết",
        icon: <ViewList />,
        onClick: () => {
          navigate(record?.taskId);
        },
      },

      {
        key: "UPDATE_DETAIL",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          if (moment().diff(moment(record?.createdDate), "days") >= 1) {
            message.error("Đã quá hạn cập nhật báo cáo!");
          } else {
            setSelectingOrderReport(record);
            setOpenUpdateModal(true);
          }
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
        return <span>{index + 1 + (currentPage - 1) * PageSize.LEADER_REPORT_LIST}</span>;
      },
    },
    {
      key: "orderName",
      title: "Tên đơn hàng",
      render: (_, record) => {
        return record?.orderName ?? "";
      },
      sorter: (a, b) => a.orderName.localeCompare(b.orderName),
    },
    {
      key: "taskName",
      title: "Tên công việc",
      render: (_, record) => {
        return record?.taskName ?? "";
      },
      sorter: (a, b) => a.taskName.localeCompare(b.taskName),
    },
    {
      key: "createdDate",
      title: "Ngày tạo",
      render: (_, record) => {
        return record?.createdDate ? formatDate(record?.createdDate, "DD/MM/YYYY") : "";
      },
      sorter: (a, b) => a.createdDate.localeCompare(b.createdDate),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (_, record) => {
        let data = orderReportMap[record?.status];
        return <strong className={data?.color}>{data ? data.label : ""}</strong>;
      },
      sorter: (a, b) => a.status - b.status,
    },
    {
      key: "action",
      title: "Thao tác",
      render: (_, record) => {
        return (
          <Dropdown menu={{ items: getActionOrderReports(record) }}>
            <Button className="mx-auto flex-center" icon={<More />} />
          </Dropdown>
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
        pagination={{
          onChange: onPageChange,
          pageSize: PageSize.LEADER_REPORT_LIST,
          total: reports?.total,
        }}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm báo cáo...",
          onSearch: setSearch,
          width: 300,
        }}
      />

      <OrderReportUpdateModal
        idOrderReport={selectingOrderReport?.id}
        open={openUpdateModal}
        onCancel={() => setOpenUpdateModal(false)}
        getReports={getReports}
      />
    </>
  );
};
