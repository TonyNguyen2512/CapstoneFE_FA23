import React, { useState } from "react";
import { Button, Card, Col, Dropdown, Image, Row, Space, Table, Tag, Tooltip } from "antd";
import {
  ErrorImage,
  ReportMap,
  ReportType,
  ReportTypeMap,
  orderReportMap,
} from "../../../../../constants/enum";
import { formatDate, formatMoney, formatNum } from "../../../../../utils";

const TaskReportDetail = ({ data, supplies }) => {
  console.log("progress", data?.reportType);

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
          <Tooltip title={() => <img src={record.materialName} className="w-full" />}>
            {record.materialName}
          </Tooltip>
          // <span onClick={() => showModal(record)}>{record.name}</span>
        );
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Mã vật liệu (SKU)",
      dataIndex: "materialSku",
      key: "materialSku",
      // align: "center",
      sorter: (a, b) => a.materialSku.localeCompare(b.materialSku),
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a?.amount.localeCompare(b?.amount),
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
      dataIndex: "materialSupplier",
      key: "materialSupplier",
      sorter: (a, b) => a.materialSupplier.localeCompare(b.materialSupplier),
    },
    {
      title: "Mã màu",
      dataIndex: "color",
      key: "color",
      // align: "center",
      render: (_, color) => {
        return (
          <Tooltip title={color?.materialColor}>
            <Button
              block
              type="primary"
              style={{ background: color?.materialColor }}
              align="center"
            ></Button>
          </Tooltip>
        );
      },
      // sorter: (a, b) => a.addedDate.localeCompare(b.addedDate),
    },
  ];

  return (
    <Space direction="vertical" className="w-full gap-6">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card style={{ borderRadius: "1rem" }}>
            <Row gutter={[16, 16]}>
              <Col className="gutter-row" span={12}>
                Tên báo cáo: <strong>{data?.title}</strong>
              </Col>
              <Col className="gutter-row" span={12}>
                Tên người báo cáo: <strong>{data?.reporterName}</strong>
              </Col>

              <Col className="gutter-row" span={12}>
                Ngày tạo báo cáo: <strong>{formatDate(data?.createdDate, "DD/MM/YYYY")}</strong>
              </Col>
              <Col className="gutter-row" span={12}>
                <span>
                  Trạng thái:{" "}
                  <strong className={orderReportMap[data?.status]?.color}>
                    {orderReportMap[data?.status]?.label}
                  </strong>
                </span>
              </Col>
              <Col className="gutter-row" span={12}>
                Tên đơn hàng: <strong>{data?.orderName}</strong>
              </Col>
              {data?.reportType === ReportType.ProgressReport && (
                <Col className="gutter-row" span={12}>
                  Số sản phẩm thất bại: <strong>{data?.itemFailed}</strong>
                </Col>
              )}
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card className="flex-col" style={{ borderRadius: "1rem" }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <strong>Nội dung:</strong>
              </Col>
              <Col span={24}>
                <span>{data?.content}</span>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card className="flex-col" style={{ borderRadius: "1rem" }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <strong>Tệp đính kèm:</strong>
              </Col>
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  {data?.resource?.map((x) => (
                    <Col span={3}>
                      <Image src={x} fallback={ErrorImage} width="100%" />
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      {data?.reportType === ReportType.ProblemReport && (
        <Table pagination={false} dataSource={supplies} columns={columns}></Table>
      )}
    </Space>
  );
};

export default TaskReportDetail;
