import { Edit, Forbid, More, Unlock } from "@icon-park/react";
import { Button, Dropdown, Space, Tag, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import RoleApi from "../../../../apis/role";
import UserApi from "../../../../apis/user";
import { BaseTable } from "../../../../components/BaseTable";
import { roles } from "../../../../constants/app";
import { getRoleName } from "../../../../utils";
import { OrderModal } from "../../components/OrderModal";
import OrderApi from "../../../../apis/order";
import { orderColors, orderLabels } from "../../../../constants/enum";

const OrderList = () => {
  const [loading, setLoading] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [orders, setOrders] = useState([]);

  const orderRef = useRef();
  const rolesRef = useRef();

  const getData = async (keyword) => {
    setLoading(true);
    const data = await UserApi.searchUsers(keyword);
    data.sort((a, b) => {
      if (a.role.name === roles.ADMIN) {
        return -1; // a comes before b
      }
      if (b.role.name === roles.ADMIN) {
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
    const response = await OrderApi.getAllOrders();
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
    const { status } = record;

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
        label: "Chi tiết đơn hàng",
        icon: <Edit />,
        onClick: () => {
          orderRef.current = record;
          setShowOrderModal(true);
        },
      },
      // {
      //   key: "SET_STATUS",
      //   label: ,
      //   // danger: !status,
      //   // icon: !status ? <Forbid /> : <Unlock />,
      //   onClick: () => {
      //     // update the status
      //   },
      //   disabled: role === roles.ADMIN,
      // },
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
      title: "Tên khách hàng",
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
      dataIndex: "quoteDate",
      key: "quoteDate",
      sorter: (a, b) => a.quoteDate.localeCompare(b.quoteDate),
    },
    {
      title: "Ngày nghiệm thu",
      dataIndex: "acceptanceDate",
      key: "acceptanceDate",
      sorter: (a, b) => a.acceptanceDate.localeCompare(b.acceptanceDate),
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        return (
          <span style={{ color: orderColors[status], fontWeight: "bold" }}>
            orderLabels[status]
          </span>
        );
      },
      sorter: (a, b) => a.status - b.status,
      filter: {
        placeholder: "Chọn tình trạng",
        label: "Tình trạng",
        filterOptions: orderLabels.map((e, index) => {
          return {
            label: e,
            value: index,
          };
        }),
      },
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
        pagination={false}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm đơn đặt hàng...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      {/* <OrderModal
        user={orderRef.current}
        open={showOrderModal}
        onCancel={() => setShowOrderModal(false)}
        onSuccess={() => getData()}
      /> */}
    </>
  );
};

export default OrderList;
