import { Edit, Error, Forbid, Lightning, More, Unlock, ViewList } from "@icon-park/react";
import { PageSize, orderColors, orderLabels } from "../../../../constants/enum";
import { Button, Dropdown, Space, Tag, message } from "antd";
import { BaseTable } from "../../../../components/BaseTable";
import React, { useEffect, useRef, useState } from "react";
import { OrderModal } from "../../components/OrderModal";
import routes from "../../../../constants/routes";
import { roles } from "../../../../constants/app";
import { useNavigate } from "react-router-dom";
import OrderApi from "../../../../apis/order";
import UserApi from "../../../../apis/user";
import dayjs from "dayjs";
import { UpdateStatus } from "../../components/UpdateStatus";
import { formatMoney, formatNum } from "../../../../utils";

const OrderList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState([]);
  const [totalOrder, setTotalOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const orderRef = useRef();

  const getData = async (keyword, pageIndex) => {
    setLoading(true);
    const data = await UserApi.getAll();
    data.sort((a, b) => {
      if (a.role?.name === roles.ADMIN) {
        return -1; // a comes before b
      }
      if (b.role?.name === roles.ADMIN) {
        return 1; // b comes before a
      }
      return 0; // no change in order
    });

    const foreman = await UserApi.getByForemanRole();
    setAccounts(foreman.data);
    // setAccounts(
    //   data.map((d) => {
    //     return {
    //       ...d,
    //       role: d.role?.name || "",
    //     };
    //   })
    // );
    const response = await OrderApi.getAllOrders(keyword, pageIndex, PageSize.ORDER_LIST);
    setOrders(response.data || []);
    setTotal(response.total || []);
    setLoading(false);
  };

  // const getAllRoles = async () => {
  //   const result = await RoleApi.getAllRoles();
  //   rolesRef.current = result.filter((e) => e.name !== roles.ADMIN);
  // };

  useEffect(() => {
    getData(null, 1);
  }, []);

  const onPageChange = (current) => {
    setCurrentPage(current);
    getData(null, current);
  };

  const getActionItems = (record) => {
    return [
      {
        key: "VIEW_ORDER_DETAIL",
        label: "Xem chi tiết",
        color: "blue",
        icon: <ViewList />,
        onClick: () => {
          navigate(record?.id);
        },
      },
      {
        key: "UPDATE_ORDER",
        label: "Cập nhật đơn hàng",
        icon: <Edit />,
        onClick: () => {
          orderRef.current = record;
          setShowOrderModal(true);
        },
      },
      {
        key: "UPDATE_ORDER_STATUS",
        label: "Cập nhật trạng thái đơn hàng",
        icon: <Lightning />,
        onClick: () => {
          orderRef.current = record;
          setUpdateModal(true);
        },
      },
      {
        key: "CANCEL_ORDER",
        label: "Huỷ đơn",
        danger: true,
        icon: <Error />,
        onClick: async () => {
          if (window.confirm("Bạn chắc chắn muốn xoá?")) {
            let success = await OrderApi.deleteOrder(record.id);
            if (success) {
              message.success(`Huỷ đơn hàng thành công!`);
            } else {
              message.error(`Huỷ đơn hàng thất bại! Vui lòng thử lại sau.`);
            }
            getData();
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
        return <span>{index + 1 + (currentPage - 1) * PageSize.ORDER_LIST}</span>;
      },
    },
    {
      title: "Tên đơn hàng",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name - b.name,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a, b) => a.customerName - b.customerName,
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
      dataIndex: "orderDate",
      key: "orderDate",
      render: (_, { orderDate }) => <span>{dayjs(orderDate).format("DD/MM/YYYY")}</span>,
      sorter: (a, b) => a.orderDate - b.orderDate,
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
      // filter: {
      //   placeholder: "Chọn tình trạng",
      //   label: "Tình trạng",
      //   filterOptions: orderLabels.map((e, index) => {
      //     return {
      //       label: e,
      //       value: index,
      //     };
      //   }),
      // },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
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
    getData(value, 1);
  };

  return (
    <>
      <Space className="w-full flex justify-between mb-6">
        <div></div>
        <Button
          type="primary"
          className="btn-primary app-bg-primary font-semibold text-white"
          onClick={() => setShowOrderModal(true)}
        >
          Thêm đơn hàng
        </Button>
      </Space>
      <BaseTable
        title="Quản lý đơn đặt hàng"
        dataSource={orders}
        totalList={total}
        columns={columns}
        loading={loading}
        pagination={{
          onChange: onPageChange,
          pageSize: PageSize.ORDER_LIST,
          total: total,
        }}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm đơn đặt hàng...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      <OrderModal
        data={orderRef.current}
        users={accounts || []}
        open={showOrderModal}
        isCreate={!orderRef.current}
        onCancel={() => {
          setShowOrderModal(false);
          orderRef.current = null;
        }}
        onSuccess={() => getData()}
      />
      <UpdateStatus
        data={orderRef.current}
        open={updateModal}
        onCancel={() => {
          setUpdateModal(false);
          orderRef.current = null;
        }}
        onSuccess={() => getData()}
      />
    </>
  );
};

export default OrderList;
