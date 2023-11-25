import React, { useContext, useEffect, useState } from "react";
import { BaseTable } from "../../../../../components/BaseTable";
import { formatMoney, formatNum } from "../../../../../utils";
import { TaskContext } from "../../../../../providers/task";

export const LeaderTaskMaterials = ({
  title,
}) => {
  const [loading, setLoading] = useState(false);
  const { material } = useContext(TaskContext);

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
  };

  return (
    <BaseTable
      title={title}
      dataSource={material?.listFromOrder}
      columns={columns}
      loading={loading}
      pagination={{ pageSize: 3 }}
      rowKey={(record) => record.materialId}
      searchOptions={{
        visible: true,
        placeholder: "Tìm kiếm vật liệu...",
        onSearch: handleSearch,
        width: 300,
      }}
    />
  );
};
