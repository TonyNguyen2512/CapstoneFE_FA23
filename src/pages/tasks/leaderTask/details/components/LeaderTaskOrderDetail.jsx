import React, { useEffect, useState } from "react";
import { BaseTable } from "../../../../../components/BaseTable";

export const LeaderTaskOrderDetail = ({
  title,
  dataSource
}) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("test detail order view")
    console.log(dataSource)
    const dataDetails = [];
    if(dataSource?.data) {
      dataSource.data?.forEach((data) => {
        // console.log(data)
        dataDetails.push({
          id: data.id,
          name: data.item.name,
          quantity: data.quantity,
          price: data.price,
          totalPrice: data.totalPrice,
        });
      });
    }
    setOrderDetails(dataDetails);
  }, [dataSource]);

  const getData = (keyword) => {
    // setLoading(true);
    // setLoading(false);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: "5%",
      // align: "center",
      render: (_, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: "Loại vật liệu",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.item.name.localeCompare(b.item.name),
    },
    {
      title: "Mã vật liệu",
      dataIndex: "sku",
      key: "sku",
      sorter: (a, b) => a.sku.localeCompare(b.sku),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      sorter: (a, b) => a.quantity.localeCompare(b.quantity),
    },
    {
      title: "Số lượng đã dùng",
      dataIndex: "quantityUsed",
      key: "quantityUsed",
      align: "center",
      sorter: (a, b) => a.quantityUsed.localeCompare(b.quantityUsed),
    },
    {
      title: "Đơn giá",
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (totalPrice) => {
        const number = formatNum(totalPrice);
        return `${number.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}`;
      },
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "thiệt hại",
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (totalPrice) => {
        const number = formatNum(totalPrice);
        return `${number.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}`;
      },
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Thành tiền",
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (totalPrice) => {
        const number = formatNum(totalPrice);
        return `${number.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}`;
      },
      sorter: (a, b) => a.amount - b.amount,
    },
  ];

  const formatNum = (value) => {
    return (value || 0) * 1;
  }

  const handleSearch = (value) => {
    getData(value);
  };

  return (
    <>
      <BaseTable
        title={title}
        dataSource={orderDetails}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 3 }}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm vật liệu...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
    </>
  );
};
