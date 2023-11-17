import React, { useEffect, useState } from "react";
import { BaseTable } from "../../../../../components/BaseTable";
import { formatMoney, formatNum } from "../../../../../utils";

export const LeaderTaskMaterials = ({
  title,
  dataSource
}) => {
  const [materialsInfo, setMaterialsInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMaterialsInfo(dataSource?.listFromOrder);
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
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (price) => {
        const money = formatNum(price);
        return `${formatMoney(money)}`;
      },
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "center",
      render: (totalPrice) => {
        const money = formatNum(totalPrice);
        return `${formatMoney(money)}`;
      },
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
  ];

  const handleSearch = (value) => {
    getData(value);
  };

  return (
    <>
      <BaseTable
        title={title}
        dataSource={materialsInfo}
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
