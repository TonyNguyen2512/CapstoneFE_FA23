import { Typography, Col, Row, Space } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { BaseTable } from "../../../../../components/BaseTable";
import { mockMaterials } from "../../../../../__mocks__/jama/materials";


export const LeaderTaskMaterial = ({
  title,
  dataSource
}) => {
  const { Title } = Typography;
  const [material, setMaterial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    setMaterial(dataSource);
  });

  const showModal = (item) => {
    setLoading(true);
    setPreviewUrl(item.imageUrl);
    setLoading(false);
    setIsModalOpen(true);
  };


  const getData = async (keyword) => {
    setLoading(true);
    // const data = await UserApi.searchUsers(keyword);
    // data.sort((a, b) => {
    //   if (a.role === roles.ADMIN) {
    //     return -1; // a comes before b
    //   }
    //   if (b.role === roles.ADMIN) {
    //     return 1; // b comes before a
    //   }
    //   return 0; // no change in order
    // });
    // setTaskList(data);
    const data = mockMaterials.filter(x => x.name.indexOf(keyword) > -1);
    setMaterial(data);
    setLoading(false);
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
      render: (_, record) => {
        return <span onClick={() => showModal(record)}>{record.name}</span>;
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Mã vật liệu",
      dataIndex: "sku",
      key: "sku",
      render: (_, record) => {
        return <span onClick={() => showModal(record)}>{record.sku}</span>;
      },
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
        dataSource={material}
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
