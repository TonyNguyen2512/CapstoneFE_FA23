import { Button, Dropdown, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import moment from "moment";
import OrderReportApi from "../../../../../apis/order-report";
import { BaseTable } from "../../../../../components/BaseTable";
import { ReportMap } from "../../../../../constants/enum";
import { UserContext } from "../../../../../providers/user";
import { Edit, More, ViewList } from "@icon-park/react";
import { formatDate } from "../../../../../utils";
import OrderReportUpdateModal from "../../components/OrderReportUpdateModal";

export const OrderReportList = () => {
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectingOrderReport, setSelectingOrderReport] = useState();

  const getReports = async () => {
    setLoading(true);
    // const data = await OrderReportApi.getAll(pageIndex, pageSize, search);
    const data = await OrderReportApi.getByForemanId(user?.id, pageIndex, pageSize, search);
    setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    if (user?.id) {
      getReports();
    }
  }, [user?.id, pageSize, pageIndex]);

  useEffect(() => {
    if (pageIndex != 1) {
      setPageIndex(1);
    } else {
      getReports();
    }
  }, [search]);

  const getActionOrderReports = (record) => {
    return [
      {
        key: "VIEW_DETAIL",
        label: "Xem thông tin chi tiết",
        icon: <ViewList />,
        onClick: () => {
          navigate(record?.id);
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
      key: "createdDate",
      title: "Ngày tạo",
      render: (_, record) => {
        return record?.createdDate ? formatDate(record?.createdDate, "DD/MM/YYYY") : "";
      },
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (_, record) => {
        let data = ReportMap[record?.status];
        return <strong className={data?.color}>{data ? data.label : ""}</strong>;
      },
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
          current: pageIndex,
          pageSize: pageSize, //<= reports?.total ? pageSize : reports?.total,
          total: reports?.total,
          onChange: setPageIndex,
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
      />
    </>
  );
};
