import { OrderDetailsContext } from "../../../../providers/orderDetails";
import { Button, Card, Col, Row, Spin, Typography } from "antd";
import OrderApi from "../../../../apis/order";
import { useParams } from "react-router-dom";
import { DocDetail, Download } from "@icon-park/react";
import React, { useContext, useState } from "react";
import dayjs from "dayjs";
import { orderLabels } from "../../../../constants/enum";

const { Title } = Typography;

export const OrderDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const { details, users, list } = useContext(OrderDetailsContext);

  const handleExport = async () => {
    setLoading(true);
    try {
      const data = await OrderApi.exportOrder(id);

      var fileName = new Date() + "order-export.pdf";
      var downloadFile = new Blob([data], { type: "application/pdf" });
      var fileURL = window.URL.createObjectURL(downloadFile);
      var a = document.createElement("a");
      a.download = fileName;
      a.href = fileURL;
      a.click();
    } catch (err) {
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  const handleDownload = (url, type) => {
    // var fileName = type + "order-export.pdf";
    var a = document.createElement("a");
    // a.download = fileName;
    a.href = url;
    a.click();
  };

  return (
    <Spin spinning={loading}>
      <Card title="Chi tiết đơn hàng">
        <Title level={5} style={{ fontWeight: 500 }}>
          Tên đơn hàng: {details?.name}
        </Title>
        <Row className="mt-4" gutter={[16, 16]}>
          <Col className="gutter-row" span={9}>
            Người tạo đơn: <strong>{details?.createdBy}</strong>
          </Col>
          <Col className="gutter-row" span={9}>
            Người được giao: <strong>{details?.assignTo}</strong>
          </Col>
          <Col className="gutter-row" span={6}>
            Trạng thái: <strong>{orderLabels[details?.status]}</strong>
          </Col>

          <Col className="gutter-row" span={9}>
            Tên khách hàng: <strong>{details?.customerName}</strong>
          </Col>
          <Col className="gutter-row" span={9}>
            Ngày tạo đơn: <strong>{dayjs(details?.createTime).format("HH:mm DD/MM/YYYY")}</strong>
          </Col>
          <Col className="gutter-row" span={6}>
            Báo giá xưởng: <strong>{details?.totalPrice}</strong>
          </Col>

          <Col className="gutter-row" span={9}>
            Bảng báo giá:{" "}
            {details?.fileQuote ? (
              <strong>
                <a href="javascript:;" onClick={() => handleDownload(details?.fileQuote, "Quote")}>
                  Tải xuống
                </a>
              </strong>
            ) : (
              <strong>{"{Trống}"}</strong>
            )}
          </Col>
          <Col className="gutter-row" span={9}>
            Hợp đồng:{" "}
            {details?.fileContract ? (
              <strong>
                <a
                  href="javascript:;"
                  onClick={() => handleDownload(details?.fileContract, "Contract")}
                >
                  Tải xuống
                </a>
              </strong>
            ) : (
              <strong>{"{ Trống }"}</strong>
            )}
          </Col>
          <Col className="gutter-row" span={6}>
            <Button
              className="flex-center border-2 border-gray-400 text-gray-600"
              icon={<DocDetail />}
              title="Export"
              name="Export"
              onClick={handleExport}
            >
              Tải PDF
            </Button>
          </Col>
        </Row>
      </Card>
    </Spin>
  );
};
