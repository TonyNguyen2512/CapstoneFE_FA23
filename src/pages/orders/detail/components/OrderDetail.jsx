import { Card, Descriptions, Typography } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { OrderDetailsContext } from "../../../../providers/orderDetails";
import dayjs from "dayjs";

const { Title } = Typography;

export const OrderDetail = () => {
  const navigate = useNavigate();

  const { details, users, list } = useContext(OrderDetailsContext);

  return (
    <Card title="Chi tiết đơn hàng">
      <Title level={5} style={{ fontWeight: 500 }}>
        Tên đơn hàng: {details?.name}
      </Title>

      <Descriptions
        className="mt-4"
        items={[
          {
            label: "Tên khách hàng",
            children: details?.customerName,
          },
          {
            label: "Ngày tạo đơn",
            children: dayjs(details?.createTime).format("HH:mm DD/MM/YYYY"),
          },
          {
            label: " Báo giá xưởng",
            children: details?.totalPrice,
          },
          {
            label: "Bản vẽ 2D",
            children: "banve2d.pdf",
          },
          {
            label: "Bản vẽ 3D",
            children: "banve3d.pdf",
          },
          {
            label: " Bản vẽ kỹ thuật",
            children: "banvekythuat.pdf",
          },
        ]}
      />
    </Card>
  );
};
