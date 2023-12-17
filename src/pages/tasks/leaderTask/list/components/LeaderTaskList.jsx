import { More, PreviewOpen } from "@icon-park/react";
import { Button, Dropdown } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { BaseTable } from "../../../../../components/BaseTable";
import { useNavigate } from "react-router-dom";
import OrderApi from "../../../../../apis/order";
import { PageSize, orderColors, orderLabels } from "../../../../../constants/enum";
import { dateSort, formatMoney, formatNum } from "../../../../../utils";
import { UserContext } from "../../../../../providers/user";

const LeaderTaskList = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const userRef = useRef();

  const getData = async (search, pageIndex, handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }

    const data = await OrderApi.getByForemanId(
      user?.id,
      search,
      pageIndex,
      PageSize.LEADER_TASK_ORDER_LIST
    );
    setOrderList(data);
    setLoading(false);
  };

  useEffect(() => {
    getData(null, 1, true);
  }, []);

  const getActionItems = (record) => {
    const { id } = record;

    return [
      {
        key: "VIEW_DETAIL",
        label: "Xem thông tin chi tiết",
        icon: <PreviewOpen />,
        onClick: () => {
          userRef.current = record;
          navigate(id);
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
        return <span>{index + 1 + (currentPage - 1) * PageSize.LEADER_TASK_ORDER_LIST}</span>;
      },
    },
    {
      title: "Tên đơn hàng",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: "Báo giá xưởng",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      render: (totalPrice) => {
        const price = formatNum(totalPrice);
        return `${formatMoney(price)}`;
      },
    },
    {
      title: "Ngày tạo đơn",
      dataIndex: "createTime",
      key: "createTime",
      render: (_, { createTime }) => createTime ? <span>{dayjs(createTime).format("DD/MM/YYYY")}</span> : <span>-</span>,

      sorter: (a, b) => dateSort(a.createTime, b.createTime),
    },
    // {
    //   title: "Ngày nghiệm thu",
    //   dataIndex: "quoteTime",
    //   key: "quoteTime",
    //   render: (_, { quoteTime }) =>
    //     quoteTime ? <span>{dayjs(quoteTime).format("DD/MM/YYYY")}</span> : <span>-</span>,
    //   sorter: (a, b) => dateSort(a?.quoteTime, b?.quoteTime),
    // },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <span style={{ color: orderColors[status], fontWeight: "bold" }}>
          {orderLabels[status]}
        </span>
      ),
      sorter: (a, b) => a.status - b.status,
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
    setCurrentPage(1);
    getData(value, 1, true);
    console.log("setCurrentPage", currentPage)
  };

  const onPageChange = (current) => {
    setCurrentPage(current);
    getData(null, current, false);
  };

  return (
    <>
      <BaseTable
        title="Danh sách đơn hàng"
        dataSource={orderList?.data}
        columns={columns}
        loading={loading}
        pagination={{
          onChange: onPageChange,
          pageSize: PageSize.LEADER_TASK_ORDER_LIST,
          total: orderList?.total,
          current: currentPage,
        }}
        rowKey={(record) => record.id}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm đơn hàng...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
    </>
  );
};

export default LeaderTaskList;
