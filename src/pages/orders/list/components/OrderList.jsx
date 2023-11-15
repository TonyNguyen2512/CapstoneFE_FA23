import { Edit, Error, Forbid, More, Unlock, ViewList } from "@icon-park/react";
import { orderColors, orderLabels } from "../../../../constants/enum";
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

const OrderList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [orders, setOrders] = useState([]);

  const orderRef = useRef();

  const getData = async (keyword) => {
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
    setAccounts(
      data.map((d) => {
        return {
          ...d,
          role: d.role?.name || "",
        };
      })
    );
    const response = await OrderApi.getAllOrders(keyword);
    setOrders(response.data || []);
    setLoading(false);
  };

  // const getAllRoles = async () => {
  //   const result = await RoleApi.getAllRoles();
  //   rolesRef.current = result.filter((e) => e.name !== roles.ADMIN);
  // };

  useEffect(() => {
    getData();
  }, []);

  const getActionItems = (record) => {
    return [
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
        key: "VIEW_ORDER_DETAIL",
        label: "Chi tiết",
        color: "blue",
        icon: <ViewList />,
        onClick: () => {
          navigate(record?.id);
        },
      },
      {
        key: "CANCEL_ORDER",
        label: "Huỷ đơn",
        danger: true,
        icon: <Error />,
        onClick: async () => {
          // if (confirm('')) {
          let success = await OrderApi.deleteOrder(record.id);
          if (success) {
            message.success(`Huỷ đơn hàng thành công!`);
          } else {
            message.error(`Huỷ đơn hàng thất bại! Vui lòng thử lại sau.`);
          }
          getData();
          // }
        },
      },
    ];
  };

  const columns = [
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
      title: "Báo giáo xưởng",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: (a, b) => a.totalPrice.localeCompare(b.totalPrice),
    },
    {
      title: "Ngày tạo đơn",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (_, { orderDate }) => <span>{dayjs(orderDate).format("DD/MM/YYYY")}</span>,
      sorter: (a, b) => a.orderDate.localeCompare(b.orderDate),
    },
    {
      title: "Ngày nghiệm thu",
      dataIndex: "acceptanceDate",
      key: "acceptanceDate",
      render: (_, { acceptanceDate }) =>
        acceptanceDate ? <span>{dayjs(acceptanceDate).format("DD/MM/YYYY")}</span> : <></>,
      sorter: (a, b) => a?.acceptanceDate?.localeCompare(b?.acceptanceDate),
    },
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
    getData(value);
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
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 8 }}
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
    </>
  );
};

export default OrderList;
