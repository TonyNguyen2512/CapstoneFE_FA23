import { Edit, Error, Forbid, More, Quote, Unlock, ViewList } from "@icon-park/react";
import { orderColors, orderLabels } from "../../../../constants/enum";
import { Button, Dropdown, Space, Tag, message } from "antd";
import { BaseTable } from "../../../../components/BaseTable";
import React, { useEffect, useRef, useState } from "react";
import { QuoteModal } from "../../components/QuoteModal";
import { roles } from "../../../../constants/app";
import { useNavigate } from "react-router-dom";
import UserApi from "../../../../apis/user";
import dayjs from "dayjs";
import QuoteApi from "../../../../apis/quotes";

const QuoteList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [quotes, setQuotes] = useState([]);

  const quoteRef = useRef();

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
      data
        .filter((e) => e.role && e.role?.name === "Foreman")
        .map((d) => {
          return {
            ...d,
            role: d.role?.name || "",
          };
        })
    );
    console.log(accounts);
    const response = await QuoteApi.getAllQuotes(keyword);
    setQuotes(response.data || []);
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
        label: "Cập nhật báo giá",
        icon: <Edit />,
        onClick: () => {
          quoteRef.current = record;
          setShowModal(true);
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
          if (window.confirm("Bạn chắc chắn muốn xoá?")) {
            let success = await QuoteApi.deleteQuote(record.id);
            if (success) {
              message.success(`Huỷ báo giá thành công!`);
            } else {
              message.error(`Huỷ báo giá thất bại! Vui lòng thử lại sau.`);
            }
            getData();
          }
        },
      },
    ];
  };

  const columns = [
    {
      title: "Tên báo giá",
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
      title: "Báo giá đơn hàng",
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
    getData(value);
  };

  return (
    <>
      <Space className="w-full flex justify-between mb-6">
        <div></div>
        <Button
          type="primary"
          className="btn-primary app-bg-primary font-semibold text-white"
          onClick={() => setShowModal(true)}
        >
          Thêm báo giá
        </Button>
      </Space>
      <BaseTable
        title="Quản lý báo giá"
        dataSource={quotes}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 8 }}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm báo giá...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
      <QuoteModal
        data={quoteRef.current}
        users={accounts || []}
        open={showModal}
        isCreate={!quoteRef.current}
        onCancel={() => {
          setShowModal(false);
          quoteRef.current = null;
        }}
        onSuccess={() => getData()}
      />
    </>
  );
};

export default QuoteList;
