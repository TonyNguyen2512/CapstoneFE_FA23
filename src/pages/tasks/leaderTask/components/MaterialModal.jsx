import { Modal, Tooltip, Button, Table, Col } from "antd";
import { useEffect, useState } from "react";
import { BaseTable } from "../../../../components/BaseTable";
import OrderApi from "../../../../apis/order";
import { formatMoney, formatNum } from "../../../../utils";
import Title from "antd/lib/skeleton/Title";

export const MaterialModal = ({ open, orderId, title, onCancel }) => {
  const [materialList, setMaterialList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const response = await OrderApi.getQuoteMaterialByOrderId(orderId);
    setMaterialList(response.listFromOrder);
    console.log(response.listFromOrder);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

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
      title: "Tên vật liệu",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        console.log(record.image);
        return (
          <Tooltip title={() => <img src={record.image} className="w-full" />}>
            {record.name}
          </Tooltip>
          // <span onClick={() => showModal(record)}>{record.name}</span>
        );
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Mã vật liệu (SKU)",
      dataIndex: "sku",
      key: "sku",
      // align: "center",
      sorter: (a, b) => a.sku.localeCompare(b.sku),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a?.quantity.localeCompare(b?.quantity),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (totalPrice) => {
        const price = formatNum(totalPrice);
        return `${formatMoney(price)}`;
      },
      sorter: (a, b) => a?.price.localeCompare(b?.price),
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) => {
        const price = formatNum(totalPrice);
        return `${formatMoney(price)}`;
      },
      sorter: (a, b) => a?.totalPrice.localeCompare(b?.totalPrice),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      sorter: (a, b) => a.supplier.localeCompare(b.supplier),
    },
    {
      title: "Mã màu",
      dataIndex: "color",
      key: "color",
      // align: "center",
      render: (_, color) => {
        return (
          <Tooltip title={color?.color}>
            <Button
              block
              type="primary"
              style={{ background: color?.color }}
              align="center"
            ></Button>
          </Tooltip>
        );
      },
      // sorter: (a, b) => a.addedDate.localeCompare(b.addedDate),
    },
  ];

  return (
    <Modal footer={null} open={open} width="80%" onCancel={onCancel} title={title}>
      <Table
        pagination={false}
        // title={title}
        dataSource={materialList}
        columns={columns}
        loading={loading}
      />
    </Modal>
  );
};
